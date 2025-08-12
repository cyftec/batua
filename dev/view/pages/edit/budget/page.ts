import { trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { unstructuredValue } from "../../../../_kvdb";
import { getBudgetEditor } from "../../../../controllers/state";
import { TIME_PERIODS } from "../../../../controllers/transforms";
import { Tag, TagsList } from "../../../components";
import { Label, NumberBox, Section, Select, TextBox } from "../../../elements";
import { EditPage } from "../@components";

const {
  onPageMount,
  editableItemTitle,
  itemProps: { title, period, amount, oneOf, allOf },
  unSelectedTags,
  error,
  onChange,
  onTagSelect,
  onTagAdd,
  onFormValidate,
  onSave,
} = getBudgetEditor();

export default EditPage({
  error: error,
  editableItemType: "budget",
  editableItemTitle: editableItemTitle,
  onMount: onPageMount,
  validateForm: onFormValidate,
  onSave: onSave,
  content: m.Div([
    Section({
      title: "Basic details",
      children: [
        Label({ text: "Budget period" }),
        Select({
          anchor: "left",
          options: TIME_PERIODS,
          selectedOptionIndex: trap(TIME_PERIODS).indexOf(period),
          onChange: (index) => onChange({ period: TIME_PERIODS[index] }),
        }),
        Label({ text: "Budget title" }),
        TextBox({
          cssClasses: `w-100 ba bw1 br3 b--light-silver pa2`,
          text: title,
          placeholder: "title of the budget",
          onchange: (title) => onChange({ title }),
        }),
        Label({ text: "Budget limit" }),
        NumberBox({
          cssClasses: `w-100 ba bw1 br3 b--light-silver pa2`,
          num: amount,
          placeholder: "title of the budget",
          onchange: (amount) => onChange({ amount }),
        }),
      ],
    }),
    Section({
      title: "Associated tags",
      children: [
        m.Div({
          class: "ba bw1 br3 b--light-silver pl2 pt2 pb1",
          children: [
            m.Div({
              class: "mr2 f6",
              children: [
                `For a transaction to be included in `,
                m.If({
                  subject: title,
                  isTruthy: (title) => `'${title.value}'`,
                  isFalsy: () => `this`,
                }),
                ` budget, it must have,`,
              ],
            }),
            Label({ unpadded: true, text: "ALL of these tags" }),
            m.Div({
              children: [
                m.Div({
                  class: "flex flex-wrap",
                  children: m.For({
                    subject: trap(allOf).map(unstructuredValue),
                    map: (tag, index) =>
                      m.Span({
                        class: "f8 fw5 flex items-center mb2 silver",
                        children: [
                          Tag({
                            onClick: () => onTagSelect(index, false, "and"),
                            size: "small",
                            state: "selected",
                            children: tag,
                          }),
                          m.If({
                            subject: index !== allOf.value.length - 1,
                            isTruthy: () => "&nbsp;&&nbsp;",
                          }),
                        ],
                      }),
                  }),
                }),
                TagsList({
                  onTagAdd: (name) => onTagAdd(name, true, "and"),
                  onTagTap: (index) => onTagSelect(index, true, "and"),
                  onlyShowFiltered: true,
                  placeholder: "search and select, or create new",
                  tagClasses: "mb2 mr2",
                  tags: trap(unSelectedTags).map(unstructuredValue),
                }),
              ],
            }),
            m.Div({
              class: "mr2 f7 black",
              children: [
                m.Div({
                  class: "bg-white ml3 ph1 pt2 nb1 sticky z-1 w-fit-content",
                  children: "along with",
                }),
                m.Div({ class: "mb3 bt b--light-silver" }),
              ],
            }),
            Label({ unpadded: true, text: "ANY ONE of these tags" }),
            m.Div({
              children: [
                m.Div({
                  class: "flex flex-wrap",
                  children: m.For({
                    subject: trap(oneOf).map(unstructuredValue),
                    map: (tag, index) =>
                      m.Span({
                        class: "f8 fw5 flex items-center mb2 silver",
                        children: [
                          Tag({
                            onClick: () => onTagSelect(index, false, "or"),
                            size: "small",
                            state: "selected",
                            children: tag,
                          }),
                          m.If({
                            subject: index !== oneOf.value.length - 1,
                            isTruthy: () => "&nbsp;/&nbsp;",
                          }),
                        ],
                      }),
                  }),
                }),
                TagsList({
                  onTagAdd: (name) => onTagAdd(name, true, "or"),
                  onTagTap: (index) => onTagSelect(index, true, "or"),
                  onlyShowFiltered: true,
                  placeholder: "search and select, or create new",
                  tagClasses: "mb2 mr2",
                  tags: trap(unSelectedTags).map(unstructuredValue),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]),
});
