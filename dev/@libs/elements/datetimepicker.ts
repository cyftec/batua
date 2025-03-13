import { component, m } from "@mufw/maya";
import { derived, dstring, val } from "@cyftech/signal";
import {
  getDateInputLocaleValue,
  getDiffDaysFromToday,
  WEEKDAYS,
} from "../common";

type DateTimePickerProps = {
  classNames?: string;
  dateOnly?: boolean;
  dateTime: Date;
  onchange: (value: Date) => void;
};

export const DateTimePicker = component<DateTimePickerProps>(
  ({ classNames, dateOnly, dateTime, onchange }) => {
    console.log(dateTime.toString() + "sdfkjajsn");
    const dayOfWeek = derived(() => {
      return WEEKDAYS[dateTime.value.getDay()].substring(0, 3);
    });
    const dateTimeInputValue = derived(() =>
      getDateInputLocaleValue(dateTime.value)
    );
    const daysDiff = derived(() => getDiffDaysFromToday(dateTime.value));

    return m.Div({
      class: dstring`dark-gray flex items-center justify-between ${classNames}`,
      children: [
        m.Div({
          class: "ph3 pv2 br3 ba bw1 b--light-gray",
          children: [
            m.Span(dayOfWeek),
            m.Span({ class: "pr3 mr3 br b--light-gray bw1" }),
            m.Input({
              class: "bn pointer",
              type: derived(() =>
                dateOnly?.value ? "date" : "datetime-local"
              ),
              value: dateTimeInputValue,
              onchange: (e) =>
                onchange(new Date((e.target as HTMLInputElement).value)),
            }),
          ],
        }),
        m.Span({
          class: dstring`${() => (daysDiff.value.isFuture ? "red" : "silver")}`,
          children: dstring`${() => daysDiff.value.label}`,
        }),
      ],
    });
  }
);
