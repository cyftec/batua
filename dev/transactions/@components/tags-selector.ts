import { Component, HtmlNode, m } from "@maya/core";
import { dstr, source, val } from "@maya/signal";
import { Tag, TextBox } from "../../@libs/ui-kit";

type TagsSelectorProps = {
  classNames?: string;
  placeholder?: string;
  selectedTags: string[];
  onSelectionChange: (newTags: string[]) => void;
};

export const TagsSelector: Component<TagsSelectorProps> = ({
  classNames,
  placeholder,
  selectedTags,
  onSelectionChange,
}) => {
  let textbox: HtmlNode;
  const searchText = source("");

  const addTag = (tag: string) => {
    if (!tag) return;
    const tagString = tag.replace(/[^a-zA-Z ]/g, "").toLowerCase();
    searchText.value = tagString;
    searchText.value = "";
    if (!val(selectedTags).includes(tagString)) {
      onSelectionChange([...val(selectedTags), tagString]);
    }
    textbox?.focus();
  };

  const removeTag = (tag: string) => {
    if (!tag || !val(selectedTags).includes(tag)) return;
    onSelectionChange(val(selectedTags).filter((t) => t !== tag));
  };

  return m.Div({
    class: dstr`flex flex-wrap ${classNames}`,
    children: [
      m.Span({
        class: "flex flex-wrap",
        children: m.For({
          items: selectedTags,
          n: 1000,
          nthChild: () => {
            textbox = TextBox({
              classNames: "inline-flex bn mb2 ph2",
              placeholder,
              text: searchText,
              onchange: addTag,
            });
            return textbox;
          },
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
};
