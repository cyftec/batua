import { component, m, MHtmlElement } from "@mufw/maya";
import { TextBox, type CustomKeyDownEvent } from "./TextBox";
import { tmpl, trap } from "@cyftech/signal";

type SuggestiveTextboxProps = {
  cssClasses?: string;
  textboxClasses?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  text?: string;
  suggestion?: string;
  onmount?: (currentElement: MHtmlElement<HTMLInputElement>) => void;
  onchange?: (value: string) => void;
  onkeydown?: (event: CustomKeyDownEvent) => void;
  onfocus?: () => void;
  onblur?: () => void;
};

export const SuggestiveTextbox = component<SuggestiveTextboxProps>(
  ({
    cssClasses,
    textboxClasses,
    placeholder,
    disabled,
    error,
    text,
    suggestion,
    onmount,
    onchange,
    onkeydown,
    onfocus,
    onblur,
  }) => {
    return m.Div({
      class: tmpl`${cssClasses}`,
      children: [
        m.If({
          subject: error,
          isTruthy: () =>
            m.Div({
              class: "red f8",
              children: error,
            }),
        }),
        m.Div({
          class: "relative",
          children: [
            m.Span({
              class: tmpl`bn bg-transparent normal outline-0 relative absolute--fill themecol ${textboxClasses}`,
              children: trap(suggestion).or("&nbsp;"),
            }),
            TextBox({
              cssClasses: tmpl`pl0 bn bg-transparent normal outline-0 absolute absolute--fill ${textboxClasses}`,
              placeholder,
              disabled,
              text,
              onmount,
              onchange,
              onkeydown,
              onfocus,
              onblur,
            }),
          ],
        }),
      ],
    });
  }
);
