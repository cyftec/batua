import { derive, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  ID_KEY,
  UNSTRUCTURED_RECORD_VALUE_KEY,
  unstructuredValue,
} from "../../../../_kvdb";
import { Budget, BudgetRaw, Tag as TagModel } from "../../../../models/core";
import { db } from "../../../../state/localstorage/stores";
import { TIME_PERIODS } from "../../../../state/transforms";
import {
  deepTrimmedLowercase,
  getLowercaseTagName,
  nameRegex,
} from "../../../../state/utils";
import { Tag, TagsList } from "../../../components";
import { Label, NumberBox, Section, Select, TextBox } from "../../../elements";
import { EditPage } from "../@components";

const error = signal("");
const budget = signal<BudgetRaw>({
  title: "",
  period: "Week",
  amount: 0,
  oneOf: [],
  allOf: [],
});
const { title, period, amount, oneOf, allOf } = trap(budget).props;
const editableBudget = signal<Budget | undefined>(undefined);
const allTags = signal<TagModel[]>([]);
const unSelectedTags = derive(() => {
  const selectedTagNames = [
    ...allOf.value.map(unstructuredValue),
    ...oneOf.value.map(unstructuredValue),
  ];
  return allTags.value.filter(
    (t) => !selectedTagNames.includes(unstructuredValue(t))
  );
});

const onPageMount = (urlParams: URLSearchParams) => {
  allTags.value = db.tags.get();
  const budgetId = +(urlParams.get("id") || "");
  if (!budgetId) return;
  const fetchedBudget = db.budgets.get(budgetId);
  if (!fetchedBudget) throw `No budget found in DB for id - ${budgetId}`;
  editableBudget.value = fetchedBudget;
};

const resetError = () => (error.value = "");

const onPeriodSelect = (index: number) => {
  resetError();
  budget.set({ period: TIME_PERIODS[index] });
};

const onTitleChange = (title: string) => {
  resetError();
  budget.set({ title });
};

const onAmountChange = (amount: number) => {
  resetError();
  budget.set({ amount });
};

const onTagSelect = (
  tagIndex: number,
  isSelected: boolean,
  andOr: "and" | "or"
) => {
  resetError();
  if (isSelected) {
    const tag = unSelectedTags.value[tagIndex];
    budget.set({
      allOf: andOr === "and" ? [...allOf.value, tag] : allOf.value,
      oneOf: andOr === "or" ? [...oneOf.value, tag] : oneOf.value,
    });
  } else {
    const isAnd = andOr === "and";
    let tag = isAnd ? allOf.value[tagIndex] : oneOf.value[tagIndex];
    budget.set({
      allOf: allOf.value.filter((t) =>
        isAnd ? unstructuredValue(t) !== unstructuredValue(tag) : true
      ),
      oneOf: oneOf.value.filter((t) =>
        isAnd ? true : unstructuredValue(t) !== unstructuredValue(tag)
      ),
    });
  }
};

const onTagAdd = (
  tagName: string,
  isSelected: boolean,
  andOr: "and" | "or"
) => {
  const tagsList = isSelected
    ? unSelectedTags.value
    : andOr === "and"
    ? allOf.value
    : oneOf.value;
  const tagIndex = tagsList.findIndex((t) => unstructuredValue(t) === tagName);

  if (tagIndex < 0) {
    const newTagName = getLowercaseTagName(tagName);
    try {
      db.tags.push(newTagName);
    } catch (error) {
      return false;
    }
    allTags.value = db.tags.get();
    return true;
  }
  onTagSelect(tagIndex, isSelected, andOr);
  return true;
};

const validateForm = () => {
  let err = "";
  if (!nameRegex.test(title.value)) err = "Invalid title for budget";
  if (amount.value < 1) err = "Budget amount should be greater than zero";
  if (allOf.value.length === 0 && oneOf.value.length === 0)
    err = "Add at least one tag for this budget";
  const existing = db.budgets.find(
    (b) => deepTrimmedLowercase(b.title) === deepTrimmedLowercase(title.value)
  );
  if (existing) err = `Budget with similar name '${existing.title}' exists.`;
  error.value = err;
};

const onBudgetSave = () => {
  db.budgets.push(budget.value);
};

export default EditPage({
  error: error,
  editableItemType: "budget",
  editableItemTitle: "",
  onMount: onPageMount,
  validateForm: validateForm,
  onSave: onBudgetSave,
  content: m.Div([
    Section({
      title: "Basic details",
      children: [
        Label({ text: "Budget period" }),
        Select({
          anchor: "left",
          options: TIME_PERIODS,
          selectedOptionIndex: trap(TIME_PERIODS).indexOf(period),
          onChange: onPeriodSelect,
        }),
        Label({ text: "Budget title" }),
        TextBox({
          cssClasses: `w-100 ba bw1 br3 b--light-silver pa2`,
          text: title,
          placeholder: "title of the budget",
          onchange: onTitleChange,
        }),
        Label({ text: "Budget limit" }),
        NumberBox({
          cssClasses: `w-100 ba bw1 br3 b--light-silver pa2`,
          num: amount,
          placeholder: "title of the budget",
          onchange: onAmountChange,
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
