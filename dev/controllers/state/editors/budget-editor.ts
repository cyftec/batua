import { newUnstructuredRecord, unstructuredValue } from "@cyftec/kvdb";
import { derive } from "@cyftech/signal";
import { Budget } from "../../../models/data-models";
import { getLowercaseTagName, nameRegex } from "../../utils";
import { store } from "../state";
import { getItemEditor } from "./item-editor";

export const getBudgetEditor = () => {
  const budgetValidator = (budget: Budget) => {
    if (!nameRegex.test(budget.title)) return "Invalid title for budget";
    else if (budget.amount < 1)
      return "Budget amount should be greater than zero";
    else if (budget.allOf.length === 0 && budget.oneOf.length === 0)
      return "Add at least one tag for this budget";
    else return "";
  };

  const {
    initializeEditor,
    editableItemTitle,
    itemProps,
    itemProps: { oneOf, allOf },
    error,
    onChange,
    onFormValidate,
    onSave,
  } = getItemEditor<Budget>(store.budgets, "title", budgetValidator);

  const unSelectedTags = derive(() => {
    const selectedTagNames = [
      ...allOf.value.map(unstructuredValue),
      ...oneOf.value.map(unstructuredValue),
    ];
    return store.tags.list.value.filter(
      (t) => !selectedTagNames.includes(unstructuredValue(t))
    );
  });

  const onPageMount = (urlParams: URLSearchParams) => {
    store.initialize();
    const editableBudgetId = +(urlParams.get("id") || "");
    initializeEditor(editableBudgetId);
  };

  const onTagSelect = (
    tagIndex: number,
    isSelected: boolean,
    andOr: "and" | "or"
  ) => {
    if (isSelected) {
      const tag = unSelectedTags.value[tagIndex];
      onChange({
        allOf: andOr === "and" ? [...allOf.value, tag] : allOf.value,
        oneOf: andOr === "or" ? [...oneOf.value, tag] : oneOf.value,
      });
    } else {
      const isAnd = andOr === "and";
      let tag = isAnd ? allOf.value[tagIndex] : oneOf.value[tagIndex];
      onChange({
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
    const tagIndex = tagsList.findIndex(
      (t) => unstructuredValue(t) === tagName
    );

    if (tagIndex < 0) {
      const newTagName = getLowercaseTagName(tagName);
      try {
        const newlyCreatedTag = store.tags.save(
          newUnstructuredRecord(newTagName)
        );
        const newTagIndex = unSelectedTags.value.findIndex(
          (t) => t.id === newlyCreatedTag.id
        );
        onTagSelect(newTagIndex, isSelected, andOr);
      } catch (error) {
        console.log(error);
        return false;
      }
      return true;
    }
    onTagSelect(tagIndex, isSelected, andOr);
    return true;
  };

  return {
    onPageMount,
    initializeEditor,
    editableItemTitle,
    itemProps,
    unSelectedTags,
    error,
    onChange,
    onTagSelect,
    onTagAdd,
    onFormValidate,
    onSave,
  } as const;
};
