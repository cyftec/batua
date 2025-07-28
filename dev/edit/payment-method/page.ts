import { derive, effect, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { phase } from "@mufw/maya/utils";
import { db } from "../../@controller/localstorage/stores";
import {
  AccountUI,
  CURRENCY_TYPES,
  CurrencyType,
  PaymentMethod,
  PaymentMethodUI,
} from "../../@controller/models/core";
import { capitalize, nameRegex, uniqueIdRegex } from "../../@controller/utils";
import { Label, Link, Select, TextBox } from "../../@view/elements";
import { TableRecordID } from "../../@kvdb";
import { EditPage } from "../@components";

const error = signal("");
const paymentMethodType = signal<CurrencyType>("physical");
const paymentMethodName = signal("");
const paymentMethodUniqueID = signal("");
const paymentMethodSlaveOf = signal<AccountUI | undefined>(undefined);
const allAccounts = signal<(AccountUI & { isSelected: boolean })[]>([]);
const editablePaymentMethod = signal<PaymentMethodUI | undefined>(undefined);
const editablePaymentMethodName = derive(
  () => editablePaymentMethod.value?.name || ""
);

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
  let err = "";
  if (!paymentMethodName.value) err = "Name is empty.";
  if (!nameRegex.test(paymentMethodName.value)) err = "Invalid method name.";
  if (
    paymentMethodUniqueID.value &&
    !uniqueIdRegex.test(paymentMethodUniqueID.value)
  )
    err = "Invalid method id.";
  error.value = err;
};

const onPaymentMethodSave = () => {
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

const onPageMount = (urlParams: URLSearchParams) => {
  // The value of paymentMethodType should be "digitial" initially.
  // But just to trigger other signals derived from paymentMethodType
  // its value is initially set to "physical" and here it is set to
  // "digital" to trigger its derivatives
  paymentMethodType.value = "digital";
  const idStr = urlParams.get("id");
  if (!idStr) return;
  const pmID: TableRecordID = +idStr;
  editablePaymentMethod.value = db.paymentMethods.get(pmID);
};

export default EditPage({
  error: error,
  editableItemTitle: editablePaymentMethodName,
  editableItemType: "payment method",
  validateForm: validateForm,
  onSave: onPaymentMethodSave,
  onMount: onPageMount,
  content: m.Div([
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
      targetFormattor: (opt) => `${capitalize(opt)} Payments`,
      optionFormattor: (opt) =>
        m.Div({
          children: [
            m.Div({ class: "f8 silver", children: `Can do` }),
            m.Div({
              class: "f5",
              children: `${capitalize(opt)} payments`,
            }),
          ],
        }),
      onChange: (o) => (paymentMethodType.value = CURRENCY_TYPES[o]),
    }),
    Label({ text: "Name of the method" }),
    TextBox({
      cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
      text: paymentMethodName,
      placeholder: "like GPay, PayPal, etc.",
      onchange: (text) => (paymentMethodName.value = text.trim()),
    }),
    Label({ text: "Unique id" }),
    TextBox({
      cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
      text: paymentMethodUniqueID,
      placeholder: "Unique id of the method",
      onchange: (text) => (paymentMethodUniqueID.value = text.trim()),
    }),
    // TODO: Implement a lock for slave payment method
  ]),
});
