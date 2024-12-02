import { Component, drstr, m, signal } from "@maya/core";
import { Icon, TextBox } from "../../@libs/ui-kit";

type TagsSelectorProps = {
  classNames?: string;
  placeholder?: string;
  selectedTags: string[];
  onSelectionChange: (newTags: string[]) => void;
};

export const TagsSelector = Component<TagsSelectorProps>(
  ({ classNames, placeholder, selectedTags, onSelectionChange }) => {
    const searchText = signal("");

    const addTag = (tag: string) => {
      if (!tag) return;
      const tagString = tag.replace(/[^a-zA-Z ]/g, "").toLowerCase();
      searchText.value = tagString;
      searchText.value = "";
      if (!selectedTags.value.includes(tagString)) {
        onSelectionChange([...selectedTags.value, tagString]);
      }
    };

    const removeTag = (tag: string) => {
      if (!tag || !selectedTags.value.includes(tag)) return;
      onSelectionChange(selectedTags.value.filter((t) => t !== tag));
    };

    return m.Div({
      class: drstr`flex flex-wrap ${classNames}`,
      children: [
        m.Span({
          class: "flex flex-wrap",
          children: m.For({
            items: selectedTags,
            map: (tag) =>
              m.Span({
                class: "bg-near-white mb2 ph2 pv1 br2 flex items-center mr2",
                children: [
                  m.Span({ children: m.Text(tag) }),
                  Icon({
                    className: "ml2 pointer silver",
                    style: "font-size: 16px;",
                    onClick: () => removeTag(tag),
                    iconName: "do_not_disturb_on",
                    title: "Remove tag",
                  }),
                ],
              }),
          }),
        }),
        TextBox({
          classNames: "inline-flex bn mb2 ph2",
          placeholder,
          text: searchText,
          onchange: addTag,
        }),
      ],
    });
  }
);
