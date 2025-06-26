import { component, m } from "@mufw/maya";
import { tmpl, effect } from "@cyftech/signal";
import { handleTap } from "../common/utils";

export type DropdownOption = {
  id: string;
  label: string;
  isSelected: boolean;
};

type DropDownProps = {
  cssClasses?: string;
  withBorder?: boolean;
  options: DropdownOption[];
  onchange: (optionId: string) => void;
};

export const DropDown = component<DropDownProps>(
  ({ cssClasses, withBorder, options, onchange }) => {
    return m.Select({
      class: tmpl`pointer bg-near-white ba bw1 outline-0 fw6 ${() =>
        withBorder?.value
          ? "b--light-silver"
          : "b--transparent"} ${cssClasses}`,
      onchange: handleTap((e) =>
        onchange((e.target as HTMLSelectElement).value)
      ),
      children: m.For({
        subject: options,
        map: (option) => {
          return m.Option({
            class: "f5",
            selected: option.isSelected,
            value: option.id,
            // onclick: handleTap((e: Event) => e.stopPropagation()),
            children: option.label,
          });
        },
      }),
    });
  }
);
