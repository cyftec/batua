import { component, m } from "@mufw/maya";
import { derived, dstring, type MaybeSignal, val } from "@cyftech/signal";
import { Icon } from "../elements/icon";

type SectionTitleProps = {
  classNames?: string;
  iconName?: string;
  label: string;
};

export const SectionTitle = component<SectionTitleProps>(
  ({ classNames, iconName, label }) =>
    m.Div({
      class: dstring`flex items-center mt3 gray f5 fw4 ${classNames}`,
      children: [
        m.If({
          subject: iconName,
          isTruthy: Icon({
            size: 24,
            className: "mr2",
            iconName: iconName as MaybeSignal<string>,
          }),
        }),
        label.value.toUpperCase(),
      ],
    })
);
