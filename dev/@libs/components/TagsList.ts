import { derive, effect, op, signal, tmpl, trap } from "@cyftech/signal";
import { component, m, MHtmlElement } from "@mufw/maya";
import { Tag } from ".";
import { deepTrimmedLowercase } from "../common/utils";
import { CustomKeyDownEvent, SuggestiveTextbox } from "../elements";

type TagsListProps = {
  onTagTap?: (tagIndex: number) => void;
  onTagAdd?: (tagName: string) => boolean;
  cssClasses?: string;
  tagsContainerClasses?: string;
  tagClasses?: string;
  placeholder?: string;
  hideSuggestion?: boolean;
  suggestExact?: boolean;
  tags: string[];
};

export const TagsList = component<TagsListProps>(
  ({
    onTagTap,
    onTagAdd,
    cssClasses,
    tagsContainerClasses,
    tagClasses,
    placeholder,
    hideSuggestion,
    suggestExact,
    tags,
  }) => {
    let textboxElem: MHtmlElement<HTMLInputElement>;
    const existingTag = signal("");
    const textboxText = signal("");
    const filteredTags = derive(() => {
      const tbVal = textboxText.value.toLowerCase();
      return tags.value.filter((t) => t.toLowerCase().includes(tbVal));
    });
    const suggestion = signal("");
    const suggestionText = derive(() =>
      (
        textboxText.value + suggestion.value.slice(textboxText.value.length)
      ).replaceAll(" ", "&nbsp;")
    );

    effect(() => {
      const shouldSuggextExact = !!suggestExact?.value;
      const shoudlHideSuggestion = !!hideSuggestion?.value;
      const tbText = textboxText.value;
      suggestion.value =
        shoudlHideSuggestion || !tbText
          ? ""
          : tags.value.find((t) => {
              return shouldSuggextExact
                ? t.startsWith(tbText)
                : deepTrimmedLowercase(t).startsWith(
                    deepTrimmedLowercase(tbText)
                  );
            }) || tbText;
    });

    effect(() => console.log(`Suggestion - '${suggestionText.value}'`));

    const onTextboxKeydown = ({ key, text }: CustomKeyDownEvent) => {
      textboxText.value = text;
      existingTag.value = "";

      if (key === "Backspace") suggestion.value = textboxText.value;
      if (key === "Enter" && textboxElem) {
        const readyForAdd = hideSuggestion?.value
          ? textboxText.value
          : textboxText.value && textboxText.value === suggestion.value;

        if (onTagAdd && readyForAdd) {
          const addedSuccessfully = onTagAdd(text);
          if (!addedSuccessfully) {
            existingTag.value = text;
            return;
          }
        }

        const suggestionMatchRequired =
          !hideSuggestion?.value &&
          textboxText.value &&
          textboxText.value !== suggestion.value;

        textboxText.value = suggestionMatchRequired ? suggestion.value : "";
        textboxElem.value = suggestionMatchRequired ? suggestion.value : "";
        textboxElem.focus();
      }
    };

    const onTagClick = (tagName: string) => {
      if (onTagTap) {
        const tagIndex = tags.value.findIndex((t) => t === tagName);
        onTagTap(tagIndex);
      }
    };

    return m.Div({
      class: cssClasses,
      children: [
        m.If({
          subject: onTagAdd,
          isTruthy: () =>
            SuggestiveTextbox({
              onmount: (tbElem) => (textboxElem = tbElem),
              onkeydown: onTextboxKeydown,
              cssClasses: tmpl`w-70 f6 ph2 pv1 br3 ba bw1 b--moon-gray ${tagClasses}`,
              textboxClasses: tmpl`bn ${op(existingTag).ternary(
                "red",
                "black"
              )} `,
              placeholder: trap(placeholder).or("add new"),
              suggestion: suggestionText,
            }),
        }),
        m.Div({
          class: tmpl`w-100 flex flex-wrap ${tagsContainerClasses}`,
          children: m.For({
            subject: filteredTags,
            map: (tag) => {
              const tagState = derive(() =>
                existingTag.value === tag
                  ? "error"
                  : onTagTap
                  ? "idle"
                  : "selected"
              );
              return Tag({
                onClick: () => onTagClick(tag),
                cssClasses: tagClasses,
                size: "small",
                state: tagState,
                children: tag,
              });
            },
          }),
        }),
      ],
    });
  }
);
