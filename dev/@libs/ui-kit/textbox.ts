import { type Component, type DomEventValue, m } from "@maya/core";
import { dstr } from "@maya/signal";

type TextBoxProps = {
  classNames?: string;
  placeholder?: string;
  text: string;
  onchange: (value: string) => void;
  onfocus?: () => void;
  onblur?: () => void;
};

export const TextBox: Component<TextBoxProps> = ({
  classNames,
  placeholder,
  text,
  onchange,
  onfocus,
  onblur,
}) => {
  const onTextChange = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value;
    onchange(value);
  };

  return m.Input({
    class: dstr`${classNames}`,
    type: "text",
    placeholder,
    value: text,
    onchange: onTextChange as DomEventValue,
    onfocus,
    onblur,
  });
};
