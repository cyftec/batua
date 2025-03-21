import { dstring, signal } from "@cyftech/signal";
import { component, m, type MHtmlElement } from "@mufw/maya";
import { ID, TagCategory, TagUI } from "../../../@libs/common";
import { Tag, TextBox } from "../../../@libs/elements";
import { UNCATEGORISED_CATEGORY_ID } from "../../../@libs/storage/localdb/setup/initial-data/tags-and-categories";
import { allTags } from "../../../@libs/stores/tags";
import { getTagCategory } from "../../../@libs/stores/tags-categories";

type TagsSelectorProps = {
  classNames?: string;
  placeholder?: string;
  selectedTags: TagUI[];
  onSelectionChange: (updated: TagUI[]) => void;
};

export const TagsSelector = component<TagsSelectorProps>(
  ({ classNames, placeholder, selectedTags, onSelectionChange }) => {
    let textbox: MHtmlElement;
    const searchText = signal("");
    const tagSuggestions = signal<TagUI[]>([]);
    const selectedTagSuggestionIndex = signal(-1);

    const updateSuggestions = ({
      key,
      text,
    }: {
      key: string;
      text: string;
    }) => {
      console.log({ key, text });
      const initialFiltered = [[] as TagUI[], [] as TagUI[]];
      const [startsWithInputList, includesInputList] = allTags.value.reduce(
        ([startsWithArr, includesArr], curr) => {
          if (curr.name.includes(text)) {
            if (curr.name.startsWith(text))
              return [[...startsWithArr, curr], includesArr];
            else return [startsWithArr, [...includesArr, curr]];
          }

          return [startsWithArr, includesArr];
        },
        initialFiltered
      );

      tagSuggestions.value = text.length
        ? [...startsWithInputList, ...includesInputList].filter(
            (tag) => !selectedTags.value.some((t) => t.name === tag.name)
          )
        : [];

      if (key == "ArrowUp") {
        if (selectedTagSuggestionIndex.value < 0) {
          selectedTagSuggestionIndex.value = -1;
        } else {
          selectedTagSuggestionIndex.value =
            selectedTagSuggestionIndex.value - 1;
        }
      }

      if (key == "ArrowDown") {
        if (
          selectedTagSuggestionIndex.value >=
          tagSuggestions.value.length - 1
        ) {
          selectedTagSuggestionIndex.value = tagSuggestions.value.length - 1;
        } else {
          selectedTagSuggestionIndex.value =
            selectedTagSuggestionIndex.value + 1;
        }
      }

      if (key === "Enter") {
        const selectedTag =
          tagSuggestions.value[selectedTagSuggestionIndex.value];
        addTag(selectedTag?.name || text);
        selectedTagSuggestionIndex.value = -1;
        tagSuggestions.value = [];
        textbox?.focus();
      }
    };

    const addTag = (tagName: string) => {
      if (!tagName) return;
      const tagString = tagName.replace(/[^a-zA-Z ]/g, "").toLowerCase();
      searchText.value = tagString;
      searchText.value = "";
      if (!selectedTags.value.some((tag) => tag.name === tagName)) {
        const foundTag: TagUI = allTags.value.find(
          (t) => t.name === tagName
        ) || {
          id: crypto.randomUUID() as ID,
          name: tagName,
          category: getTagCategory(UNCATEGORISED_CATEGORY_ID) as TagCategory,
        };
        onSelectionChange([...selectedTags.value, foundTag]);
      }
      textbox?.focus();
    };

    const removeTag = (tagName: string) => {
      if (!tagName || !selectedTags.value.some((t) => t.name === tagName))
        return;
      onSelectionChange(selectedTags.value.filter((t) => t.name !== tagName));
    };

    return m.Div({
      class: dstring`flex flex-wrap ${classNames}`,
      children: [
        m.Span({
          class: "flex flex-wrap",
          children: m.For({
            subject: selectedTags,
            n: Infinity,
            nthChild: m.Div({
              class: "overlay-parent",
              children: [
                TextBox({
                  classNames: "inline-flex bn mb2 ph2 pv1",
                  onmount: (textboxElem) => (textbox = textboxElem),
                  placeholder,
                  text: searchText,
                  onkeydown: updateSuggestions,
                }),
                m.Div({
                  class: dstring`nt2 overlay bg-white br3 bw1 b--light-gray br--bottom ${() =>
                    tagSuggestions.value.length ? "bl br bb" : "bn"}`,
                  children: m.For({
                    subject: tagSuggestions,
                    map: (tag, i) =>
                      m.Div({
                        class: dstring`ph2 pv1 ${() =>
                          selectedTagSuggestionIndex.value === i
                            ? "bg-silver white"
                            : " bg-white black"}`,
                        children: tag.name,
                      }),
                  }),
                }),
              ],
            }),
            map: (tag) =>
              Tag({
                classNames: "mb2 ph2 pv1 mr2",
                label: tag.name,
                iconClassNames: "ml2",
                iconName: "do_not_disturb_on",
                iconHint: "Remove tag",
                onIconClick: () => removeTag(tag.name),
              }),
          }),
        }),
      ],
    });
  }
);
