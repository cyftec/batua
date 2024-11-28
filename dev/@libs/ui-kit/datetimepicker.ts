import { Component, derived, drstr, m } from "@maya/core";

type DateTimePickerProps = {
  classNames?: string;
  dateTime: Date;
  onchange: (value: Date) => void;
};

export const DateTimePicker = Component<DateTimePickerProps>(
  ({ classNames, dateTime, onchange }) => {
    const dayOfWeek = derived(() => dateTime.value.toUTCString().split(",")[0]);
    const date = derived(() => dateTime.value.toISOString().split("T")[0]);
    const time = derived(() => dateTime.value.toLocaleTimeString());
    const daysDiff = derived(() => {
      const now = new Date();
      const diffTime = now.getTime() - dateTime.value.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      console.log(diffDays);

      if (diffDays >= 0 && diffDays < 1)
        return { isFuture: false, label: "Today" };
      else if (diffDays >= 1 && diffDays < 2)
        return { isFuture: false, label: "Yesterday" };
      else if (diffDays >= 2 && diffDays < 3)
        return { isFuture: false, label: "Day before y'day" };
      else if (diffDays < 0)
        return { isFuture: true, label: "ERROR: Future date" };
      else
        return { isFuture: false, label: `${Math.floor(diffDays)} days back` };
    });

    const onDateChange = (e) => {
      onchange(new Date(e.target.valueAsNumber));
    };

    const onTimeChange = (e) => {
      console.log(e);
    };

    return m.Div({
      class: drstr`dark-gray flex items-center justify-between ${classNames}`,
      children: [
        m.Div({
          class: "ph3 pv2 br3 ba bw1 b--light-gray",
          children: [
            m.Span({
              children: m.Text(dayOfWeek),
            }),
            m.Span({ class: "pr3 mr3 br b--light-gray bw1" }),
            m.Input({
              class: "bn pointer",
              type: "time",
              value: time,
              onchange: onTimeChange,
            }),
            m.Span({ class: "pr3 mr3 br b--light-gray bw1" }),
            m.Input({
              class: "bn pointer",
              type: "date",
              value: date,
              onchange: onDateChange,
            }),
          ],
        }),
        m.Span({
          class: drstr`${() => (daysDiff.value.isFuture ? "red" : "silver")}`,
          children: m.Text(drstr`${() => daysDiff.value.label}`),
        }),
      ],
    });
  }
);
