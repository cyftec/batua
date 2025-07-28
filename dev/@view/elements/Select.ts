import { derive, DerivedSignal, op, signal, tmpl, trap } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { handleTap } from "../../@controller/utils";
import { Icon } from "./Icon";

type SelectProps = {
  cssClasses?: string;
  optionsMenuClasses?: string;
  anchor?: "left" | "center" | "right";
  size?: "large" | "medium" | "small";
  options: any[];
  selectedOptionIndex: number;
  targetFormattor?: (option: any, index?: number) => Child;
  optionFormattor?: (option: any, index?: number) => Child;
  onChange: (optionIndex: number) => void;
};

export const Select = component<SelectProps>(
  ({
    cssClasses,
    optionsMenuClasses,
    anchor,
    size,
    options,
    selectedOptionIndex,
    targetFormattor,
    optionFormattor,
    onChange,
  }) => {
    const sizeCss = derive(() =>
      size?.value === "large"
        ? "f5 br3 pl2 pv2 pr1"
        : size?.value === "small"
        ? "f8 fw5 br3 pl1 pv1 pr0"
        : "f6 br3 pl2 pv2"
    );
    const classes = tmpl`relative dib pointer outline-0 ba bw1 b--light-silver bg-white black ${sizeCss} ${cssClasses}`;
    const isOptionSelectorOpen = signal(false);
    const selectedOption = trap(options).at(
      selectedOptionIndex
    ) as DerivedSignal<any>;
    const anchorPosition = derive(() => {
      const anchorVal = anchor?.value || "center";
      return anchorVal === "left" ? 0 : anchorVal === "right" ? 100 : 50;
    });
    const formattedSelectedOption = derive(() =>
      targetFormattor
        ? targetFormattor(selectedOption.value)
        : `${selectedOption.value}`
    );
    const targetIconSize = derive(() =>
      size?.value === "large" ? 20 : size?.value === "medium" ? 16 : 12
    );

    return m.Div({
      onclick: handleTap(
        () => (isOptionSelectorOpen.value = !isOptionSelectorOpen.value)
      ),
      class: classes,
      children: [
        m.Div({
          class: "flex items-center justify-between",
          children: [
            m.Div(formattedSelectedOption),
            Icon({
              cssClasses: "ml1",
              size: targetIconSize,
              iconName: "unfold_more",
            }),
          ],
        }),
        m.Div({
          class: tmpl`mnw-40 maxh5 overflow-scroll bg-white absolute z-9999 mt3 pv1 br3 shadow-2 f5 w-max-content ${optionsMenuClasses} ${op(
            isOptionSelectorOpen
          ).ternary("db", "dn")}`,
          style: tmpl`
            left: ${anchorPosition}%;
            transform: translate(-${anchorPosition}%, 0%);
          `,
          children: m.For({
            subject: options,
            map: (option, index) => {
              const isSelected = op(selectedOptionIndex).equals(index).truthy;
              const isLast = op(options).lengthEquals(index + 1).truthy;
              const iconCss = op(isSelected).ternary("balck mr1", "white mr1");
              const optionCss = tmpl`w-100 flex items-center black db fw5 pv2 pl2 pr4 bg-transparent b--light-silver bg-white ${op(
                isLast
              ).ternary("bn", "bb bt-0 br-0 bl-0")}`;

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
                        class: "w-100 fw6 f5 tl",
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
