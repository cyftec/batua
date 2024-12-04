import { component, m } from "@maya/core";
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

export const DropDown = component<DropDownProps>(
  ({ classNames, options, onchange }) =>
    m.Select({
      class: dstr`pointer ${classNames}`,
      onchange: (e) => onchange((e.target as HTMLSelectElement).value),
      children: m.For({
        items: options,
        map: (option) =>
          m.Option({
            ...(option.isSelected ? { selected: "" } : {}),
            value: option.id,
            children: m.Text(option.label),
          }),
      }),
    })
);
