import { Component, m } from "@maya/core";
import { derived, dstr, val } from "@maya/signal";
import {
  getDateInputLocaleValue,
  getDiffDaysFromToday,
  WEEKDAYS,
} from "../common";

type DateTimePickerProps = {
  classNames?: string;
  dateTime: Date;
  onchange: (value: Date) => void;
};

export const DateTimePicker: Component<DateTimePickerProps> = ({
  classNames,
  dateTime,
  onchange,
}) => {
  const dayOfWeek = derived(() =>
    WEEKDAYS[val(dateTime).getDay()].substring(0, 3)
  );
  const dateTimeInputValue = derived(() =>
    getDateInputLocaleValue(val(dateTime))
  );
  const daysDiff = derived(() => getDiffDaysFromToday(val(dateTime)));

  return m.Div({
    class: dstr`dark-gray flex items-center justify-between ${classNames}`,
    children: [
      m.Div({
        class: "ph3 pv2 br3 ba bw1 b--light-gray",
        children: [
          m.Span(dayOfWeek),
          m.Span({ class: "pr3 mr3 br b--light-gray bw1" }),
          m.Input({
            class: "bn pointer",
            type: "datetime-local",
            value: dateTimeInputValue,
            onchange: (e) =>
              onchange(new Date((e.target as HTMLInputElement).value)),
          }),
        ],
      }),
      m.Span({
        class: dstr`${() => (daysDiff.value.isFuture ? "red" : "silver")}`,
        children: dstr`${() => daysDiff.value.label}`,
      }),
    ],
  });
};
