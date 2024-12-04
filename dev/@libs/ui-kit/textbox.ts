import { Component, DomEventValue, m } from "@maya/core";
import { drstr } from "@maya/signal";

type TextBoxProps = {
  classNames?: string;
  placeholder?: string;
  text: string;
  onchange: (value: string) => void;
};

export const TextBox = Component<TextBoxProps>(
  ({ classNames, placeholder, text, onchange }) => {
    const onTextChange = (e: KeyboardEvent) => {
      onchange((e.target as HTMLInputElement).value);
    };

    return m.Input({
      class: drstr`${classNames}`,
      type: "text",
      placeholder,
      value: text,
      onchange: onTextChange as DomEventValue,
    });
  }
);
