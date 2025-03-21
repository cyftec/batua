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
      class: dstring`w-100 ${classNames}`,
      children: [
        m.Span({
          class: dstring`w-25 f7 ml2 light-silver`,
          children: label,
        }),
        m.Div({
          class: "w-100",
          children: children,
        }),
      ],
    });
  }
);
