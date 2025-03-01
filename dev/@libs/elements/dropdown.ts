import { component, m } from "@mufw/maya";
import { dstring, effect } from "@cyftech/signal";

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
  ({ classNames, options, onchange }) => {
    return m.Select({
      class: dstring`pointer bn bg-near-white ${classNames}`,
      onchange: (e) => onchange((e.target as HTMLSelectElement).value),
      children: m.For({
        subject: options,
        map: (option) => {
          return m.Option({
            class: "pr3",
            selected: option.isSelected,
            value: option.id,
            // onclick: (e: Event) => e.stopPropagation(),
            children: option.label,
          });
        },
      }),
    });
  }
);
