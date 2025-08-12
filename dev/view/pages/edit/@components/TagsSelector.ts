import { component, m } from "@mufw/maya";
import { Tag, TagsList } from "../../../components";
import { areStringsSimilar } from "../../../../controllers/utils";

type TagsSelectorProps = {
  cssClasses?: string;
  selectedTags: string[];
  unSelectedTags: string[];
  textboxPlaceholder?: string;
  suggestExact?: boolean;
  onlyShowFiltered?: boolean;
  onChange: (name: string, isSelected: boolean) => boolean;
};

export const TagsSelector = component<TagsSelectorProps>(
  ({
    cssClasses,
    selectedTags,
    unSelectedTags,
    textboxPlaceholder,
    suggestExact,
    onlyShowFiltered,
    onChange,
  }) => {
    const onTagTap = (index: number, isSelected: boolean) => {
      const tagName = isSelected
        ? unSelectedTags.value[index]
        : selectedTags.value[index];
      onChange(tagName, isSelected);
    };

    const onTagAdd = (tagName: string) => {
      const existing = selectedTags.value.find((t) =>
        areStringsSimilar(t, tagName)
      );
      if (existing) return false;
      return onChange(tagName, true);
    };

    return m.Div({
      class: cssClasses,
      children: [
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
        TagsList({
          onTagAdd: onTagAdd,
          onTagTap: (index) => onTagTap(index, true),
          suggestExact: suggestExact,
          onlyShowFiltered: onlyShowFiltered,
          placeholder: textboxPlaceholder,
          tagClasses: "mb2 mr2",
          tags: unSelectedTags,
        }),
      ],
    });
  }
);
