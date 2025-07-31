import { signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "../../../../state/localstorage/stores";
import { BudgetRaw, Budget, Tag as TagModel } from "../../../../models/core";
import { TIME_PERIODS, TimePeriod } from "../../../../state/transforms";
import {
  deepTrimmedLowercase,
  getLowercaseTagName,
  nameRegex,
} from "../../../../state/utils";
import { primitiveValue, ID_KEY } from "../../../../_kvdb";
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
const allTags = signal<
  (TagModel & { isSelected: boolean; andOr: "and" | "or" })[]
>([]);
const [seletedTags, unSelectedTags] = trap(allTags).partition(
  (t) => t.isSelected
);
const [andTags, orTags] = trap(seletedTags).partition((t) => t.andOr === "and");

const onPageMount = (urlParams: URLSearchParams) => {
  const budgetId = +(urlParams.get("id") || "");
  if (!budgetId)
    throw `Invalid budget id - '${budgetId}' passed in url params.`;
  const fetchedBudget = db.budgets.get(budgetId);
  if (!fetchedBudget) throw `No budget found in DB for id - ${budgetId}`;
  editableBudget.value = fetchedBudget;
  allTags.value = db.tags
    .get([])
    .map((t) => ({ ...t, isSelected: false, andOr: "and" }));
};

const resetError = () => (error.value = "");

const onTagSelect = (
  tagIndex: number,
  isSelected: boolean,
  andOr: "and" | "or"
) => {
  const tag = isSelected
    ? unSelectedTags.value[tagIndex]
    : andOr === "and"
    ? andTags.value[tagIndex]
    : orTags.value[tagIndex];
  allTags.value = allTags.value.map((t) => {
    if (tag[ID_KEY] === t[ID_KEY]) {
      t.isSelected = isSelected;
      t.andOr = andOr;
    }
    return t;
  });
};

const onTagAdd = (
  tagName: string,
  isSelected: boolean,
  andOr: "and" | "or"
) => {
  const tagIndex = isSelected
    ? unSelectedTags.value.findIndex((t) => primitiveValue(t) === tagName)
    : andOr === "and"
    ? andTags.value.findIndex((t) => primitiveValue(t) === tagName)
    : orTags.value.findIndex((t) => primitiveValue(t) === tagName);

  if (tagIndex < 0) {
    const newTagName = getLowercaseTagName(tagName);
    const newTagID = db.tags.push(newTagName);
    const newTag = db.tags.get(newTagID);
    if (!newTag) throw `Error fetching the new tag after adding it to the DB.`;
    allTags.value = [
      ...allTags.value,
      { ...newTag, isSelected: true, andOr: andOr },
    ];
    return true;
  }
  onTagSelect(tagIndex, isSelected, andOr);
  return true;
};

const validateForm = () => {
  let err = "";
  if (!nameRegex.test(title.value)) err = "Invalid title for budget";
  if (amount.value < 1) err = "Budget amount should be greater than zero";
  if (andTags.value.length === 0 && orTags.value.length === 0)
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
          onChange: (index) =>
            (budget.value = { ...budget.value, period: TIME_PERIODS[index] }),
        }),
        Label({ text: "Budget title" }),
        TextBox({
          cssClasses: `w-100 ba bw1 br3 b--light-silver pa2`,
          text: title,
          placeholder: "title of the budget",
          onchange: (text) => (budget.value = { ...budget.value, title: text }),
        }),
        Label({ text: "Budget limit" }),
        NumberBox({
          cssClasses: `w-100 ba bw1 br3 b--light-silver pa2`,
          num: amount,
          placeholder: "title of the budget",
          onchange: (num) => (budget.value = { ...budget.value, amount: num }),
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
                    subject: trap(andTags).map((t) => primitiveValue(t)),
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
                            subject: index !== andTags.value.length - 1,
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
                  tags: trap(unSelectedTags).map((t) => primitiveValue(t)),
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
                    subject: trap(orTags).map((t) => primitiveValue(t)),
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
                            subject: index !== orTags.value.length - 1,
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
                  tags: trap(unSelectedTags).map((t) => primitiveValue(t)),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]),
});
