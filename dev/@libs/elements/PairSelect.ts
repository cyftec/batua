import { tmpl, trap } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { Select } from "./Select";

type PairSelectProps = {
  cssClasses?: string;
  targetClasses?: string;
  optionsMenuClasses?: string;
  anchor?: "left" | "center" | "right";
  size?: "large" | "medium" | "small";
  primaryOptions: any[];
  secondaryOptions: any[];
  primarySelectedOptionIndex: number;
  secondarySelectedOptionIndex: number;
  primaryTargetFormattor?: (option: any, index?: number) => Child;
  primaryOptionFormattor?: (option: any, index?: number) => Child;
  secondaryTargetFormattor?: (option: any, index?: number) => Child;
  secondaryOptionFormattor?: (option: any, index?: number) => Child;
  onChange: (primaryOptionIndex: number, secondaryOptionIndex: number) => void;
};

export const PairSelect = component<PairSelectProps>(
  ({
    cssClasses,
    targetClasses,
    optionsMenuClasses,
    anchor,
    size,
    primaryOptions,
    secondaryOptions,
    primarySelectedOptionIndex,
    secondarySelectedOptionIndex,
    primaryTargetFormattor,
    primaryOptionFormattor,
    secondaryTargetFormattor,
    secondaryOptionFormattor,
    onChange,
  }) => {
    return m.Div({
      class: tmpl`flex items-center ${cssClasses}`,
      children: [
        Select({
          cssClasses: targetClasses,
          optionsMenuClasses,
          anchor,
          size,
          options: primaryOptions,
          selectedOptionIndex: primarySelectedOptionIndex,
          targetFormattor: primaryTargetFormattor,
          optionFormattor: primaryOptionFormattor,
          onChange: (index) => onChange(index, 0),
        }),
        m.If({
          subject: trap(secondaryOptions).length,
          isTruthy: () =>
            Select({
              cssClasses: targetClasses,
              optionsMenuClasses,
              anchor,
              size,
              options: secondaryOptions,
              selectedOptionIndex: secondarySelectedOptionIndex,
              targetFormattor: secondaryTargetFormattor,
              optionFormattor: secondaryOptionFormattor,
              onChange: (index) =>
                onChange(primarySelectedOptionIndex.value, index),
            }),
        }),
      ],
    });
  }
);
