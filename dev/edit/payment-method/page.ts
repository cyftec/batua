import { derive, effect, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { phase } from "@mufw/maya/utils";
import { db } from "../../@libs/common/localstorage/stores";
import {
  AccountUI,
  CURRENCY_TYPES,
  CurrencyType,
  PaymentMethod,
  PaymentMethodUI,
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
  Select,
  TextBox,
} from "../../@libs/elements";
import { TableRecordID } from "../../@libs/kvdb";

const error = signal("");
const paymentMethodType = signal<CurrencyType>("physical");
const paymentMethodName = signal("");
const paymentMethodUniqueID = signal("");
const paymentMethodSlaveOf = signal<AccountUI | undefined>(undefined);
const allAccounts = signal<(AccountUI & { isSelected: boolean })[]>([]);
const editablePaymentMethod = signal<PaymentMethodUI | undefined>(undefined);
const headerLabel = derive(() =>
  editablePaymentMethod.value
    ? `Edit '${editablePaymentMethod.value.name}'`
    : `Add new payment method`
);
const commitBtnLabel = op(editablePaymentMethod).ternary("Save", "Add");

effect(() => {
  const pmType = paymentMethodType.value;
  const editablePm = editablePaymentMethod.value;
  if (!phase.currentIs("run")) return;
  allAccounts.value = db.accounts
    .getAll()
    .map((acc) => ({
      ...acc,
      isSelected: !!acc.paymentMethods
        ?.map((p) => p.id)
        .includes(editablePm?.id || -1),
    }))
    .filter((acc) => acc.vault === pmType);
});

effect(() => {
  const editablePm = editablePaymentMethod.value;
  if (!editablePm) return;
  paymentMethodType.value = editablePm.type;
  paymentMethodName.value = editablePm.name;
  paymentMethodUniqueID.value = editablePm.uniqueId || "";
  paymentMethodSlaveOf.value = editablePm.slave
    ? allAccounts.value.at(0)
    : undefined;
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
    error.value = "Invalid method id.";
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
    // TODO: Check existing method before adding
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
  // The value of paymentMethodType should be "digitial" initially.
  // But just to trigger other signals derived from paymentMethodType
  // its value is initially set to "physical" and here it is set to
  // "digital" to trigger its derivatives
  paymentMethodType.value = "digital";
  const idStr = getQueryParamValue("id");
  if (!idStr) return;
  const pmID: TableRecordID = +idStr;
  editablePaymentMethod.value = db.paymentMethods.get(pmID);
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
              class: "mb2 red",
              children: [
                Link({
                  onClick: () => {},
                  children: "Delete this payment method",
                }),
              ],
            }),
        }),
        Label({ text: "Payment type" }),
        Select({
          cssClasses: "mb2",
          anchor: "left",
          options: CURRENCY_TYPES,
          selectedOptionIndex: trap(CURRENCY_TYPES).indexOf(paymentMethodType),
          targetFormattor: (option) => `${capitalize(option)} Payments`,
          optionFormattor: (option) =>
            m.Div({
              children: [
                m.Div({ class: "f8 silver", children: `Can do` }),
                m.Div({
                  class: "f5",
                  children: `${capitalize(option)} payments`,
                }),
              ],
            }),
          onChange: (o) => (paymentMethodType.value = CURRENCY_TYPES[o]),
        }),
        Label({ text: "Name of the method" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
          text: paymentMethodName,
          placeholder: "like GPay, PayPal, etc.",
          onchange: (text) => (paymentMethodName.value = text.trim()),
        }),
        Label({ text: "Unique id" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
          text: paymentMethodUniqueID,
          placeholder: "Unique id of the method",
          onchange: (text) => (paymentMethodUniqueID.value = text.trim()),
        }),
        // TODO: Implement a lock for slave payment method
      ],
    }),
    hideNavbar: true,
    navbarTop: DialogActionButtons({
      cssClasses: "sticky bottom-0 bg-near-white pv2 ph3 nl3 nr3",
      error: error,
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
