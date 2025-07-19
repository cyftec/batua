import { trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { Tag, TagsList } from "../../@libs/components";
import { Label, SuggestiveTextbox } from "../../@libs/elements";

type TagsSelectorProps = {
  onTagTap: (index: number, isSelected: boolean) => void;
  onAdd?: (name: string) => boolean;
  cssClasses?: string;
  selectedTags: string[];
  unSelectedTags: string[];
  textboxPlaceholder?: string;
  suggestExact?: boolean;
};

export const TagsSelector = component<TagsSelectorProps>(
  ({
    onTagTap,
    onAdd,
    cssClasses,
    selectedTags,
    unSelectedTags,
    textboxPlaceholder,
    suggestExact,
  }) => {
    return m.Div({
      class: cssClasses,
      children: [
        Label({ text: "SELECTED (TAP TO UNSELECT)" }),
        m.If({
          subject: trap(selectedTags).length,
          isFalsy: () => "&nbsp;--",
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: selectedTags,
            map: (tag, index) =>
              Tag({
                onClick: () => onTagTap(index, false),
                cssClasses: "mr2 mb2",
                size: "medium",
                state: "selected",
                children: tag,
              }),
          }),
        }),
        Label({ text: "TAP TO SELECT OR CREATE NEW" }),
        TagsList({
          onTagAdd: onAdd,
          onTagTap: (index) => onTagTap(index, true),
          suggestExact: suggestExact,
          placeholder: textboxPlaceholder,
          tagClasses: "mb2 mr2",
          tags: unSelectedTags,
        }),
      ],
    });
  }
);
