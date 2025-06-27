import { derive, effect, op, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { paymentMethodsStore } from "../../@libs/common/localstorage/stores";
import {
  CURRENCY_TYPES,
  CurrencyType,
  ID,
} from "../../@libs/common/models/core";
import {
  capitalize,
  getQueryParamValue,
  nameRegex,
  uniqueIdRegex,
} from "../../@libs/common/utils";
import { HTMLPage, NavScaffold } from "../../@libs/components";
import {
  DialogActionButtons,
  DropDown,
  Icon,
  Label,
  Link,
  Section,
  TextBox,
} from "../../@libs/elements";

const error = signal("");
const paymentMethodMode = signal<CurrencyType>("digital");
const paymentMethodName = signal("");
const paymentMethodUniqueID = signal("");
const pmIdFromQuery = signal("");
const editablePaymentMethod = derive(() => {
  if (!pmIdFromQuery.value) return;
  const pmID: ID = +pmIdFromQuery.value;
  const pm = paymentMethodsStore.get(pmID);
  if (!pm) throw `Error fetching payment method for id - ${pmID}`;
  return pm;
});
const headerLabel = derive(() =>
  editablePaymentMethod.value
    ? `Edit '${editablePaymentMethod.value.name}'`
    : `Add new payment method`
);
const commitBtnLabel = op(editablePaymentMethod).ternary("Save", "Add");

effect(() => {
  if (!editablePaymentMethod.value) return;
  paymentMethodMode.value = editablePaymentMethod.value.mode;
  paymentMethodName.value = editablePaymentMethod.value.name;
  paymentMethodUniqueID.value = editablePaymentMethod.value.uniqueId || "";
});

const validateForm = () => {
  if (!paymentMethodName.value) {
    error.value = "Name is empty.";
    return;
  }
  if (!nameRegex.test(paymentMethodName.value)) {
    error.value = "Invalid method name.";
    return;
  }
  if (
    paymentMethodUniqueID.value &&
    !uniqueIdRegex.test(paymentMethodUniqueID.value)
  ) {
    error.value = "Invalid method ID.";
    return;
  }
  error.value = "";
};

const discardAndGoBack = () => {
  history.back();
};

const savePaymentMethod = () => {
  validateForm();
  if (error.value) return;
  const uniqueIdObj = paymentMethodUniqueID.value
    ? { uniqueId: paymentMethodUniqueID.value }
    : {};

  if (editablePaymentMethod.value) {
    paymentMethodsStore.update({
      ...editablePaymentMethod.value,
      name: paymentMethodName.value,
      mode: paymentMethodMode.value,
      ...uniqueIdObj,
    });
  } else {
    paymentMethodsStore.add({
      isPermanent: 0,
      name: paymentMethodName.value,
      mode: paymentMethodMode.value,
      ...uniqueIdObj,
    });
  }
  history.back();
};

const onPageMount = () => {
  const id = getQueryParamValue("id");
  if (id) pmIdFromQuery.value = id;
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: headerLabel,
    content: m.Div({
      children: [
        m.If({
          subject: editablePaymentMethod,
          isTruthy: m.Div({
            class: "mb4 red",
            children: [
              Link({
                onClick: () => {},
                children: "Delete this payment method",
              }),
            ],
          }),
        }),
        Section({
          title: "Payment method details",
          children: [
            Label({ text: "Payment mode" }),
            DropDown({
              cssClasses: "f6 pa2 br3",
              withBorder: true,
              options: CURRENCY_TYPES,
              selectedOption: paymentMethodMode,
              optionFormattor: (option) => capitalize(option),
              onChange: (op) => (paymentMethodMode.value = op as CurrencyType),
            }),
            Label({ text: "Name of the method" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: paymentMethodName,
              placeholder: "like GPay, PayPal, etc.",
              onchange: (text) => (paymentMethodName.value = text.trim()),
            }),
            Label({ text: "Unique ID" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: paymentMethodUniqueID,
              placeholder: "ID of the method",
              onchange: (text) => (paymentMethodUniqueID.value = text.trim()),
            }),
            m.If({
              subject: error,
              isTruthy: m.Div({
                class: "mt3 red",
                children: error,
              }),
            }),
          ],
        }),
      ],
    }),
    hideNavbar: true,
    navbarTop: DialogActionButtons({
      cssClasses: "sticky bottom-0 bg-near-white pv2 ph3 nl3 nr3",
      discardLabel: [
        Icon({ cssClasses: "nl2 mr2", iconName: "arrow_back" }),
        "Cancel",
      ],
      commitLabel: [
        Icon({ cssClasses: "nl3 mr2", iconName: commitBtnLabel }),
        commitBtnLabel,
      ],
      onDiscard: discardAndGoBack,
      onCommit: savePaymentMethod,
    }),
  }),
});
