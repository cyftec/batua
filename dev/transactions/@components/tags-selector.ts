import { component, type HtmlNode, m } from "@mufw/maya";
import { dstring, signal, val } from "@cyftech/signal";
import { Tag, TextBox } from "../../@libs/elements";

type TagsSelectorProps = {
  classNames?: string;
  placeholder?: string;
  selectedTags: string[];
  onSelectionChange: (newTags: string[]) => void;
};

export const TagsSelector = component<TagsSelectorProps>(
  ({ classNames, placeholder, selectedTags, onSelectionChange }) => {
    let textbox: HtmlNode;
    const searchText = signal("");

    const addTag = (tag: string) => {
      if (!tag) return;
      const tagString = tag.replace(/[^a-zA-Z ]/g, "").toLowerCase();
      searchText.value = tagString;
      searchText.value = "";
      if (!selectedTags.value.includes(tagString)) {
        onSelectionChange([...selectedTags.value, tagString]);
      }
      textbox?.focus();
    };

    const removeTag = (tag: string) => {
      if (!tag || !selectedTags.value.includes(tag)) return;
      onSelectionChange(selectedTags.value.filter((t) => t !== tag));
    };

    return m.Div({
      class: dstring`flex flex-wrap ${classNames}`,
      children: [
        m.Span({
          class: "flex flex-wrap",
          children: m.For({
            subject: selectedTags,
            n: 1000,
            nthChild: (() => {
              textbox = TextBox({
                classNames: "inline-flex bn mb2 ph2",
                placeholder,
                text: searchText,
                onchange: addTag,
              });
              return textbox;
            })(),
            map: (tag) =>
              Tag({
                classNames: "mb2 ph2 pv1 mr2",
                label: tag,
                iconClassNames: "ml2",
                iconName: "do_not_disturb_on",
                iconHint: "Remove tag",
                onIconClick: () => removeTag(tag),
              }),
          }),
        }),
      ],
    });
  }
);
