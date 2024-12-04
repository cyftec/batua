import { Component, DomEventValue, m } from "@maya/core";
import { derived } from "@maya/signal";

type NumberBoxProps = {
  classNames?: string;
  placeholder?: string;
  num: number;
  onchange: (value: number) => void;
};

export const NumberBox = Component<NumberBoxProps>(
  ({ classNames, placeholder, num, onchange }) => {
    const onTextChange = (e: KeyboardEvent) => {
      const text = (e.target as HTMLInputElement).value;
      onchange(Number.parseFloat(Number.parseFloat(text || "0").toFixed(2)));
    };

    return m.Input({
      class: classNames,
      type: "number",
      placeholder,
      value: derived(() => num.value.toString()),
      onchange: onTextChange as DomEventValue,
    });
  }
);
