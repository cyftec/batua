import { Child, m } from "@mufw/maya";
import { HtmlPage, SectionTitle } from "../@libs/components";
import { derived, DerivedSignal } from "@cyftech/signal";
import { TagsCategory, TagCategory, Tag } from "../@libs/common";
import {
  allTagCategories,
  fetchAllTagCategories,
} from "../@libs/stores/tags-categories";
import { TagsCategoryCard } from "./@components/tags-category-card";
import { allTags, fetchAllTags } from "../@libs/stores/tags";

const categoriesPairs = derived(() => {
  if (!allTags.value?.length || !allTagCategories.value) return [];

  const [fixedCats, editablesCats, emptyCats] = allTagCategories.value.reduce(
    ([nonEditables, editables, empty], cat) => {
      const tags = ((allTags as DerivedSignal<Tag[]>).value || []).filter(
        (t) => t.category === cat.name
      );
      const catWithTags: TagsCategory = {
        ...cat,
        tags,
      };

      const fixedTagsCategories = [...nonEditables];
      const editableTagsCategories = [...editables];
      const noTagsCategories = [...empty];

      if (catWithTags.tags.length) {
        if (catWithTags.isTagEditable) {
          editableTagsCategories.push(catWithTags);
        } else {
          fixedTagsCategories.push(catWithTags);
        }
      } else {
        noTagsCategories.push(catWithTags);
      }

      return [fixedTagsCategories, editableTagsCategories, noTagsCategories];
    },
    [[] as TagsCategory[], [] as TagsCategory[], [] as TagsCategory[]]
  );

  return [
    {
      title: "System generated fixed tags",
      categories: fixedCats,
    },
    {
      title: "Editable tags",
      categories: editablesCats,
    },
    {
      title: "Categories with no tags",
      categories: emptyCats,
    },
  ];
});

export default HtmlPage({
  htmlTitle: "Batua | Tags & Categories",
  headerTitle: "Categorise your transactions using tags",
  selectedTabIndex: 3,
  onDocumentMount: () => {
    fetchAllTagCategories();
    fetchAllTags();
  },
  mainContent: m.If({
    subject: allTagCategories,
    isTruthy: m.Div({
      children: m.For({
        subject: categoriesPairs,
        map: (categoryType) =>
          m.Div({
            children: [
              SectionTitle({ label: categoryType.title }),
              m.Div({
                class: "mb5",
                children: m.For({
                  subject: categoryType.categories,
                  map: (category) => TagsCategoryCard({ category }),
                }),
              }),
            ],
          }),
      }),
    }),
  }),
  sideContent: "",
});
