import { derive, DerivedSignal, op, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { getAccountEditor } from "../../../../controllers/state";
import { capitalize } from "../../../../controllers/utils";
import { CURRENCY_TYPES, CurrencyType } from "../../../../models/data-models";
import {
  Label,
  Link,
  NumberBox,
  Section,
  Select,
  TextBox,
} from "../../../elements";
import { EditPage, TagsSelector } from "../@components";

const {
  onPageMount,
  initialAccBalance,
  unSelectedPaymentMethods,
  editableItemTitle,
  accountTypeLabel,
  itemProps: {
    name: accName,
    type,
    uniqueId,
    vault,
    paymentMethods: selectedPaymentMethods,
  },
  error,
  onChange,
  onMethodSelectionChange,
  onFormValidate,
  onAccountSave,
} = getAccountEditor();

export default EditPage({
  error: error,
  editableItemType: accountTypeLabel,
  editableItemTitle: editableItemTitle,
  onMount: onPageMount,
  validateForm: onFormValidate,
  onSave: onAccountSave,
  content: m.Div([
    m.If({
      subject: editableItemTitle,
      isTruthy: () =>
        m.Div({
          class: "mb4 red",
          children: [
            Link({
              onClick: () => {},
              children: "Delete this account",
            }),
          ],
        }),
    }),
    Section({
      title: "Basic details",
      children: [
        Label({ text: "Name of account" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
          text: accName,
          placeholder: "Account name",
          onchange: (text) => onChange({ name: text }),
        }),
        Label({ text: "Unique id" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
          text: uniqueId,
          placeholder: "Unique id (optional)",
          onchange: (text) => onChange({ uniqueId: text }),
        }),
        m.If({
          subject: editableItemTitle,
          isFalsy: () =>
            m.Div([
              Label({ text: "Initial balance" }),
              NumberBox({
                cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
                num: initialAccBalance,
                placeholder: "Unique id (optional)",
                onchange: (val) => (initialAccBalance.value = val),
              }),
            ]),
        }),
      ],
    }),
    m.If({
      subject: op(type).equals("expense").truthy,
      isTruthy: () =>
        Section({
          title: "Vault and payment methods",
          children: [
            Label({ text: "My money vault type" }),
            Select({
              cssClasses: "mb2 f6 br3",
              anchor: "left",
              options: CURRENCY_TYPES,
              selectedOptionIndex: trap(CURRENCY_TYPES).indexOf(
                vault as DerivedSignal<CurrencyType>
              ),
              targetFormattor: (option) => capitalize(option),
              optionFormattor: (option) => capitalize(option),
              onChange: (o) => onChange({ vault: CURRENCY_TYPES[o] }),
            }),
            Label({ text: "Payment Methods" }),
            TagsSelector({
              onChange: onMethodSelectionChange,
              selectedTags: derive(() =>
                (selectedPaymentMethods?.value || []).map((pm) => pm.name)
              ),
              unSelectedTags: trap(unSelectedPaymentMethods).map((a) => a.name),
              textboxPlaceholder: "search and select, or create new",
            }),
          ],
        }),
    }),
  ]),
});
