import { component, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";

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
      class: dstring`pointer bn bg-near-white ${classNames}`,
      onchange: (e) => onchange((e.target as HTMLSelectElement).value),
      children: m.For({
        subject: options,
        map: (option) =>
          m.Option({
            ...(option.isSelected ? { selected: "" } : {}),
            value: option.id,
            children: option.label,
          }),
      }),
    })
);
