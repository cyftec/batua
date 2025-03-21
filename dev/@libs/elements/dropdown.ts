import { component, m } from "@mufw/maya";
import { dstring, effect } from "@cyftech/signal";

export type DropdownOption = {
  id: string;
  label: string;
  isSelected: boolean;
};

type DropDownProps = {
  classNames?: string;
  withBorder?: boolean;
  options: DropdownOption[];
  onchange: (optionId: string) => void;
};

export const DropDown = component<DropDownProps>(
  ({ classNames, withBorder, options, onchange }) => {
    return m.Select({
      class: dstring`pointer bg-near-white ${() =>
        withBorder?.value ? "ba" : "bn"} ${classNames}`,
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
