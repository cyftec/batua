import { component, m, MHtmlElement } from "@mufw/maya";
import { Tag } from "../../@libs/components";
import { CustomKeyDownEvent, Icon, TextBox } from "../../@libs/elements";
import { getLowercaseTagName } from "../../@libs/common/utils";
import { derive, DerivedSignal, op, signal, tmpl } from "@cyftech/signal";

type TagCategoryProps = {
  cssClasses?: string;
  icon: string;
  title: string;
  tags: string[];
  onTagTap?: (tagIndex: number) => void;
  onNewTagAdd?: (tagName: string) => boolean;
};

export const TagCategory = component<TagCategoryProps>(
  ({ cssClasses, icon, title, tags, onTagTap, onNewTagAdd }) => {
    let textBoxElem: MHtmlElement<HTMLInputElement>;
    const existingTag = signal("");

    const onTextboxKeydown = ({ key, text }: CustomKeyDownEvent) => {
      existingTag.value = "";
      if (key === "Enter" && textBoxElem && onNewTagAdd) {
        const tagName = getLowercaseTagName(text);
        const addedSuccessfully = onNewTagAdd(tagName);
        if (!addedSuccessfully) {
          existingTag.value = tagName;
          return;
        }
        textBoxElem.value = "";
        textBoxElem.focus();
      }
    };

    return m.Div({
      class: cssClasses,
      children: [
        m.Div({
          class: "flex items-center silver",
          children: [
            Icon({ iconName: icon, size: 14 }),
            m.Div({ class: "f7 ml2", children: title }),
          ],
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: tags,
            n: onNewTagAdd ? 0 : -1,
            nthChild: TextBox({
              onmount: (tbElem) => (textBoxElem = tbElem),
              cssClasses: tmpl`mr2 mt2 f6 br3 ph2 pv1 ba bw1 b--moon-gray ${op(
                existingTag
              ).ternary("red", "black")}`,
              placeholder: "create new tag",
              onkeydown: onTextboxKeydown,
            }),
            map: (tag, index) => {
              const tagState = derive(() =>
                existingTag.value === tag
                  ? "error"
                  : onTagTap
                  ? "selected"
                  : "idle"
              );
              return Tag({
                onClick: () => onTagTap && onTagTap(index),
                cssClasses: "mr2 mt2",
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
