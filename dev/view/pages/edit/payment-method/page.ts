import { trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { getItemEditor, store } from "../../../../controllers/state";
import {
  capitalize,
  deepTrim,
  nameRegex,
  uniqueIdRegex,
} from "../../../../controllers/utils";
import { CURRENCY_TYPES, PaymentMethod } from "../../../../models/data-models";
import { Label, Link, Select, TextBox } from "../../../elements";
import { EditPage } from "../@components";

const pmValidator = (method: PaymentMethod) => {
  if (!method.name) return "Name is empty.";
  else if (!nameRegex.test(method.name)) return "Invalid method name.";
  else if (deepTrim(method.name) !== method.name)
    return "Invalid spaces in the name.";
  else if (method.uniqueId && !uniqueIdRegex.test(method.uniqueId))
    return "Invalid method id.";
  else return "";
};

const {
  initializeEditor,
  editableItemTitle,
  itemProps: { type: pmCurrencyType, name: pmName, uniqueId: pmUniqueId },
  error,
  onChange,
  onFormValidate,
  onSave,
} = getItemEditor<PaymentMethod>(store.paymentMethods, "name", pmValidator);

const onPageMount = (urlParams: URLSearchParams) => {
  const editablePmId = +(urlParams.get("id") || "");
  initializeEditor(editablePmId);
};

export default EditPage({
  error: error,
  editableItemType: "payment method",
  editableItemTitle: editableItemTitle,
  validateForm: onFormValidate,
  onSave: onSave,
  onMount: onPageMount,
  content: m.Div([
    m.If({
      subject: editableItemTitle,
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
      selectedOptionIndex: trap(CURRENCY_TYPES).indexOf(pmCurrencyType),
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
      onChange: (index) => onChange({ type: CURRENCY_TYPES[index] }),
    }),
    Label({ text: "Name of the method" }),
    TextBox({
      cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
      text: pmName,
      placeholder: "like GPay, PayPal, etc.",
      onchange: (name) => onChange({ name }),
    }),
    Label({ text: "Unique id" }),
    TextBox({
      cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
      text: pmUniqueId,
      placeholder: "Unique id of the method",
      onchange: (uniqueId) => onChange({ uniqueId }),
    }),
  ]),
});
