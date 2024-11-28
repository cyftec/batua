import { Component, m } from "@maya/core";
import { InputBox } from "./inputbox";

type SuggestionBoxProps = {
  classNames?: string;
  placeholder?: string;
  text: string;
  suggestions: string[];
  onSuggestionSelect: (suggestionIndex: number) => void;
  onTextChange: (value: string) => void;
};

export const SuggestionBox = Component<SuggestionBoxProps>(
  ({
    classNames,
    placeholder,
    text,
    suggestions,
    onSuggestionSelect,
    onTextChange,
  }) => {
    return m.Div({
      class: "relative",
      children: [
        InputBox({
          classNames,
          type: "text",
          placeholder,
          value: text,
          onchange: onTextChange,
        }),
        m.Div({
          class: "absolute",
          children: m.For({
            items: suggestions,
            map: (item, index) =>
              SuggestionTile({
                label: item,
                onSelect: () => onSuggestionSelect(index),
              }),
          }),
        }),
      ],
    });
  }
);

type SuggestionTile = {
  label: string;
  onSelect: () => void;
};

const SuggestionTile = Component<SuggestionTile>(({ label, onSelect }) => {
  return m.Div({
    onclick: onSelect,
    children: m.Text(label),
  });
});
