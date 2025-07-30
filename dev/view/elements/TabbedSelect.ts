import { derive, op, signal, tmpl, trap } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { handleTap } from "../../state/utils";
import { Icon } from "./Icon";

type TabbedSelectOption = {
  label: string;
  icon: string;
};

type TabbedSelectProps = {
  cssClasses?: string;
  options: TabbedSelectOption[];
  selectedOptionIndex: number;
  labelPosition?: "top" | "bottom";
  onChange: (optionIndex: number) => void;
};

export const TabbedSelect = component<TabbedSelectProps>(
  ({ cssClasses, options, selectedOptionIndex, labelPosition, onChange }) => {
    const topPaddingCss = op(labelPosition)
      .equals("bottom")
      .ternary("mb3", "pt3");
    const classes = tmpl`relative ${topPaddingCss}`;

    return m.Div({
      class: cssClasses,
      children: m.Div({
        class: classes,
        children: [
          m.Div({
            class: "w-100 relative z-1 flex items-center justify-between",
            children: m.For({
              subject: options,
              map: (option, index) => {
                const colorCss = op(selectedOptionIndex)
                  .equals(index)
                  .ternary("black fw6", "silver");
                const borderCss = op(selectedOptionIndex)
                  .equals(index)
                  .ternary("b--mid-gray bw1dot5", "b--light-silver");
                const labelPositionCss = op(labelPosition)
                  .equals("bottom")
                  .ternary("bottom--1", "top--1");
                const labelCss = tmpl`absolute mb1 f6 left-50 trans-left-50 ${colorCss} ${labelPositionCss}`;
                const iconCss = tmpl`mb1 pa2 bg-white ba br-100 bw1 ${colorCss} ${borderCss}`;

                return m.Div({
                  onclick: handleTap(() => onChange(index)),
                  class: "relative flex flex-column items-center",
                  children: [
                    m.Div({
                      class: labelCss,
                      children: option.label,
                    }),
                    Icon({
                      cssClasses: iconCss,
                      iconName: option.icon,
                    }),
                  ],
                });
              },
            }),
          }),
          m.Div({
            class: `absolute left-2 right-2 bottom-1 z-0 bt bw1 pt1 b--light-gray`,
          }),
        ],
      }),
    });
  }
);
