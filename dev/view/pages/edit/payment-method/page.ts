import { signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { DbRecordID, ID_KEY } from "../../../../_kvdb";
import {
  CURRENCY_TYPES,
  PaymentMethod,
  PaymentMethodRaw,
} from "../../../../models/core";
import { db } from "../../../../state/localstorage/stores";
import {
  areNamesSimilar,
  capitalize,
  deepTrim,
  nameRegex,
  uniqueIdRegex,
} from "../../../../state/utils";
import { Label, Link, Select, TextBox } from "../../../elements";
import { EditPage } from "../@components";

const error = signal("");
const paymentMethod = signal<PaymentMethodRaw>({
  isPermanent: 0,
  name: "",
  uniqueId: "",
  type: "physical",
});
const { type, name: pmName, uniqueId } = trap(paymentMethod).props;
const editablePaymentMethod = signal<PaymentMethod | undefined>(undefined);
const editablePaymentMethodName = signal("");

const onPageMount = (urlParams: URLSearchParams) => {
  const idStr = urlParams.get("id");
  if (!idStr) return;
  const pmID: DbRecordID = +idStr;
  const editablePM = db.paymentMethods.get(pmID);
  if (!editablePM) throw `Error fetching payment method with id - ${pmID}`;
  editablePaymentMethod.value = editablePM;
  delete (editablePM as PaymentMethodRaw)[ID_KEY];
  paymentMethod.set({ ...editablePM });
};

const resetError = () => (error.value = "");

const onTypeChange = (optionIndex: number) => {
  resetError();
  paymentMethod.set({ type: CURRENCY_TYPES[optionIndex] });
};

const onNameChange = (name: string) => {
  resetError();
  paymentMethod.set({ name });
};

const validateForm = () => {
  let err = "";
  const existing = db.paymentMethods.find((pm) =>
    areNamesSimilar(pm.name, pmName.value)
  );
  if (!pmName.value) err = "Name is empty.";
  else if (!nameRegex.test(pmName.value)) err = "Invalid method name.";
  else if (deepTrim(pmName.value) !== pmName.value) {
    console.log(pmName.value);
    err = "Invalid spaces in the name.";
  } else if (uniqueId?.value && !uniqueIdRegex.test(uniqueId.value))
    err = "Invalid method id.";
  else if (existing)
    err = `A method with similar name '${existing.name}' exists already.`;
  else err = "";

  error.value = err;
};

const onPaymentMethodSave = () => {
  const uniqueIdObj = uniqueId?.value ? { uniqueId: uniqueId.value } : {};

  if (editablePaymentMethod.value) {
    const updates: Partial<PaymentMethodRaw> = {
      name: pmName.value,
      type: type.value,
      ...uniqueIdObj,
    };
    db.paymentMethods.set(editablePaymentMethod.value.id, updates);
  } else {
    db.paymentMethods.push({
      isPermanent: 0,
      name: pmName.value,
      type: type.value,
      ...uniqueIdObj,
    });
  }
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
      selectedOptionIndex: trap(CURRENCY_TYPES).indexOf(type),
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
      onChange: onTypeChange,
    }),
    Label({ text: "Name of the method" }),
    TextBox({
      cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
      text: pmName,
      placeholder: "like GPay, PayPal, etc.",
      onchange: onNameChange,
    }),
    Label({ text: "Unique id" }),
    TextBox({
      cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
      text: uniqueId,
      placeholder: "Unique id of the method",
      onchange: (text) => paymentMethod.set({ uniqueId: text.trim() }),
    }),
  ]),
});
