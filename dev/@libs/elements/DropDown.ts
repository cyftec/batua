import { dispose, op, tmpl, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../common/utils";

export type DropdownOption = {
  id: string;
  label: string;
  isSelected: boolean;
};

type DropDownProps = {
  cssClasses?: string;
  withBorder?: boolean;
  options: string[];
  selectedOption: string;
  optionFormattor?: (option: string) => string;
  onChange: (option: string) => void;
};

export const DropDown = component<DropDownProps>(
  ({
    cssClasses,
    withBorder,
    options,
    selectedOption,
    optionFormattor,
    onChange,
  }) => {
    const classes = tmpl`pointer bg-near-white ba bw1 outline-0 fw6 ${() =>
      withBorder?.value ? "b--moon-gray" : "b--transparent"} ${cssClasses}`;
    const onOptionChange = (e) => {
      onChange((e.target as HTMLSelectElement).value);
    };

    return m.Select({
      onunmount: () => dispose(classes),
      onchange: handleTap(onOptionChange),
      class: classes,
      children: m.For({
        subject: options,
        map: (option) => {
          const isSelected = op(selectedOption).equals(option).truthy;

          return m.Option({
            class: "f5",
            selected: isSelected,
            value: option,
            children: optionFormattor ? optionFormattor(option) : option,
          });
        },
      }),
    });
  }
);
