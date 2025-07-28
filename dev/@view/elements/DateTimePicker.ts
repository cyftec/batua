import { compute, derive, op, tmpl, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  getDateInputLocaleValue,
  getDiffDaysFromToday,
} from "../../@libs/common/transforms";

type DateTimePickerProps = {
  cssClasses?: string;
  dateOnly?: boolean;
  dateTime: Date;
  onchange: (value: Date) => void;
};

export const DateTimePicker = component<DateTimePickerProps>(
  ({ cssClasses, dateOnly, dateTime, onchange }) => {
    const dateTimeInputValue = compute(getDateInputLocaleValue, dateTime);
    const daysDiff = compute(getDiffDaysFromToday, dateTime);
    const { isFuture, label } = trap(daysDiff).props;

    return m.Div({
      class: tmpl`flex items-center justify-between ${cssClasses}`,
      children: [
        m.Input({
          class: "w-60 fw6 bn outline-0 pointer black",
          type: op(dateOnly).ternary("date", "datetime-local"),
          value: dateTimeInputValue,
          onchange: (e) =>
            onchange(new Date((e.target as HTMLInputElement).value)),
        }),
        m.Div({
          class: op(isFuture).ternary(
            "red tr w-inherit",
            "silver tr w-inherit"
          ),
          children: label,
        }),
      ],
    });
  }
);
