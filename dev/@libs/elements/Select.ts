import { derive, op, signal, tmpl, trap } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { handleTap } from "../common/utils";
import { Icon } from "./Icon";

type SelectProps = {
  cssClasses?: string;
  optionsMenuClasses?: string;
  anchor?: "left" | "center" | "right";
  options: string[];
  selectedOptionIndex: number;
  targetFormattor?: (option: string, index?: number) => Child;
  optionFormattor?: (option: string, index?: number) => Child;
  onChange: (optionIndex: number) => void;
};

export const Select = component<SelectProps>(
  ({
    cssClasses,
    optionsMenuClasses,
    anchor,
    options,
    selectedOptionIndex,
    targetFormattor,
    optionFormattor,
    onChange,
  }) => {
    const isOptionSelectorOpen = signal(false);
    const classes = tmpl`relative dib pointer bg-near-white ba bw1 fw6 outline-0 b--moon-gray ${cssClasses}`;
    const selectedOption = trap(options).at(selectedOptionIndex);
    const anchorPosition = derive(() => {
      const anchorVal = anchor?.value || "center";
      return anchorVal === "left" ? 0 : anchorVal === "right" ? 100 : 50;
    });
    const formattedSelectedOption = derive(() =>
      targetFormattor
        ? targetFormattor(selectedOption.value || "")
        : selectedOption.value
    );

    return m.Div({
      onclick: handleTap(
        () => (isOptionSelectorOpen.value = !isOptionSelectorOpen.value)
      ),
      class: classes,
      children: [
        m.Div({
          class: "flex items-center",
          children: [
            formattedSelectedOption,
            Icon({ cssClasses: "ml1", size: 20, iconName: "unfold_more" }),
          ],
        }),
        m.Div({
          class: tmpl`bg-white absolute z-9999 mt3 br3 shadow-2 f4 ${optionsMenuClasses} ${() =>
            isOptionSelectorOpen.value ? "db" : "dn"}`,
          style: tmpl`
            width: max-content;
            left: ${anchorPosition}%;
            transform: translate(-${anchorPosition}%, 0%);
          `,
          children: m.For({
            subject: options,
            map: (option, index) => {
              const isSelected = op(selectedOptionIndex).equals(index).truthy;
              const isLast = op(options).lengthEquals(index + 1).truthy;
              const iconCss = op(isSelected).ternary("balck mr1", "white mr1");
              const optionCss = tmpl`w-100 flex items-center black db fw5 pv2dot5 pl2 pr3 bg-transparent b--light-silver bg-white ${() =>
                isLast.value ? "bn" : "bb bt-0 br-0 bl-0"}`;

              return m.Div({
                onclick: handleTap(() => onChange(index)),
                class: optionCss,
                children: [
                  Icon({
                    cssClasses: iconCss,
                    size: 24,
                    iconName: "check",
                  }),
                  optionFormattor
                    ? optionFormattor(option, index)
                    : m.Div({
                        class: "w-100 fw6 tl",
                        children: option,
                      }),
                ],
              });
            },
          }),
        }),
      ],
    });
  }
);
