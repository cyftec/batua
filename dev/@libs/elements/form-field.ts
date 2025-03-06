import { dstring } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";

type FormFieldProps = {
  classNames?: string;
  label: string;
  children: Children;
};

export const FormField = component<FormFieldProps>(
  ({ classNames, label, children }) => {
    return m.Div({
      class: dstring`w-100 flex items-center justify-between ${classNames}`,
      children: [
        m.Span({
          class: "silver",
          children: label,
        }),
        m.Div({
          class: "w-75",
          children: children,
        }),
      ],
    });
  }
);
