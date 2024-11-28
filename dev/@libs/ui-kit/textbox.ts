import { Component, DomEventValue, drstr, m, Signal, signal } from "@maya/core";
import { InputBox } from "./inputbox";

type TextBoxProps = {
  classNames?: string;
  placeholder?: string;
  text: string;
  onchange: (value: string) => void;
};

export const TextBox = Component<TextBoxProps>(
  ({ classNames, placeholder, text, onchange }) => {
    const onTextChange = (text: string) => {
      console.log(text);
      onchange(text);
    };

    return InputBox({
      classNames,
      type: "text",
      placeholder,
      value: text,
      onchange: onTextChange,
    });
  }
);
