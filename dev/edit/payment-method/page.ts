import { derive, effect, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  CURRENCY_TYPES,
  CurrencyType,
  PaymentMethod,
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
  Icon,
  Label,
  Link,
  Section,
  Select,
  TextBox,
} from "../../@libs/elements";
import { db } from "../../@libs/common/localstorage/stores";
import { TableRecordID } from "../../@libs/common/kvdb";

const error = signal("");
const paymentMethodType = signal<CurrencyType>("digital");
const paymentMethodName = signal("");
const paymentMethodUniqueID = signal("");
const pmIdFromQuery = signal("");
const editablePaymentMethod = derive(() => {
  if (!pmIdFromQuery.value) return;
  const pmID: TableRecordID = +pmIdFromQuery.value;
  const pm = db.paymentMethods.get(pmID);
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
  paymentMethodType.value = editablePaymentMethod.value.type;
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
    error.value = "Invalid method TableRecordID.";
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
    const updates: Partial<PaymentMethod> = {
      name: paymentMethodName.value,
      type: paymentMethodType.value,
      ...uniqueIdObj,
    };
    db.paymentMethods.update(editablePaymentMethod.value.id, updates);
  } else {
    db.paymentMethods.add({
      isPermanent: 0,
      name: paymentMethodName.value,
      type: paymentMethodType.value,
      slave: false,
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
          isTruthy: () =>
            m.Div({
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
            Label({ text: "Payment type" }),
            Select({
              cssClasses: "f6 br3 pa2",
              options: CURRENCY_TYPES,
              selectedOptionIndex:
                trap(CURRENCY_TYPES).indexOf(paymentMethodType),
              optionFormattor: (option) => capitalize(option),
              onChange: (o) => (paymentMethodType.value = CURRENCY_TYPES[o]),
            }),
            Label({ text: "Name of the method" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: paymentMethodName,
              placeholder: "like GPay, PayPal, etc.",
              onchange: (text) => (paymentMethodName.value = text.trim()),
            }),
            Label({ text: "Unique TableRecordID" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: paymentMethodUniqueID,
              placeholder: "TableRecordID of the method",
              onchange: (text) => (paymentMethodUniqueID.value = text.trim()),
            }),
            m.If({
              subject: error,
              isTruthy: () =>
                m.Div({
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
