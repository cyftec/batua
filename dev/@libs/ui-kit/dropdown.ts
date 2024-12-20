import { type Component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type SelectOption = {
  id: string;
  label: string;
  isSelected: boolean;
};

type DropDownProps = {
  classNames?: string;
  options: SelectOption[];
  onchange: (optionId: string) => void;
};

export const DropDown: Component<DropDownProps> = ({
  classNames,
  options,
  onchange,
}) =>
  m.Select({
    class: dstr`pointer bn bg-near-white ${classNames}`,
    onchange: (e) => onchange((e.target as HTMLSelectElement).value),
    children: m.For({
      items: options,
      map: (option) =>
        m.Option({
          ...(option.isSelected ? { selected: "" } : {}),
          value: option.id,
          children: option.label,
        }),
    }),
  });
