import { component, type DomEventValue, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";

type TextBoxProps = {
  classNames?: string;
  placeholder?: string;
  text: string;
  onchange: (value: string) => void;
  onfocus?: () => void;
  onblur?: () => void;
};

export const TextBox = component<TextBoxProps>(
  ({ classNames, placeholder, text, onchange, onfocus, onblur }) => {
    const onTextChange = (e: KeyboardEvent) => {
      const value = (e.target as HTMLInputElement).value;
      onchange(value);
    };

    return m.Input({
      class: dstring`${classNames}`,
      type: "text",
      placeholder,
      value: text,
      onchange: onTextChange as DomEventValue,
      onfocus,
      onblur,
    });
  }
);
