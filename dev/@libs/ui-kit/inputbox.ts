import { Component, derived, DomEventValue, drstr, m } from "@maya/core";

type InputBoxProps = {
  type?: "text" | "number";
  classNames?: string;
  placeholder?: string;
  value: string | number;
  onchange: (value: string) => void;
};

export const InputBox = Component<InputBoxProps>(
  ({ type, classNames, placeholder, value, onchange }) => {
    const onTextChange = (e: KeyboardEvent) =>
      onchange((e.target as HTMLInputElement).value);

    return m.Input({
      class: drstr`db br3 bw1 ba b--light-gray ${classNames}`,
      type: type?.value || "text",
      placeholder,
      value: derived(() => value.value.toString()),
      onchange: onTextChange as DomEventValue,
    });
  }
);
