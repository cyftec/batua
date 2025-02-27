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
    m.H2({
      class: dstring`flex items-center mid-gray ${classNames}`,
      children: [
        m.If({
          subject: iconName,
          isTruthy: Icon({
            size: 28,
            className: "b mr3",
            iconName: iconName as MaybeSignal<string>,
          }),
        }),
        label.value,
      ],
    })
);
