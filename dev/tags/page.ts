import { derived, DerivedSignal, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { ID, TagCategoryUI, TagUI } from "../@libs/common";
import { HtmlPage, SectionTitle } from "../@libs/components";
import { allTags, fetchAllTags } from "../@libs/stores/tags";
import {
  allTagCategories,
  fetchAllTagCategories,
} from "../@libs/stores/tags-categories";
import { TagEditor, TagsCategoryCard } from "./@components";

const categoriesSections = derived(() => {
  if (!allTags.value?.length || !allTagCategories.value) return [];

  const [fixedCats, editablesCats, emptyCats] = allTagCategories.value.reduce(
    ([nonEditables, editables, empty], cat) => {
      const tags = ((allTags as DerivedSignal<TagUI[]>).value || []).filter(
        (t) => t.category.id === cat.id
      );
      const catWithTags = {
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
    [[] as TagCategoryUI[], [] as TagCategoryUI[], [] as TagCategoryUI[]]
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
const editableTag = signal<TagUI | undefined>(undefined);
const openEditor = (tag: TagUI) => {
  editableTag.value = tag;
};
const closeEditor = () => (editableTag.value = undefined);

export default HtmlPage({
  htmlTitle: "Batua | Tags & Categories",
  headerTitle: "Categorise your transactions using tags",
  selectedTabIndex: 3,
  onDocumentMount: () => {
    fetchAllTagCategories();
    fetchAllTags();
  },
  mainContent: [
    TagEditor({
      editableTag: editableTag,
      onDone: closeEditor,
      onCancel: closeEditor,
    }),
    m.If({
      subject: allTagCategories,
      isTruthy: m.Div({
        children: m.For({
          subject: categoriesSections,
          map: (categorySection) =>
            m.Div({
              children: [
                SectionTitle({ label: categorySection.title }),
                m.Div({
                  class: "mb5",
                  children: m.For({
                    subject: categorySection.categories,
                    map: (category) =>
                      TagsCategoryCard({
                        category,
                        onTagEdit: openEditor,
                      }),
                  }),
                }),
              ],
            }),
        }),
      }),
    }),
  ],
  sideContent: "",
});
