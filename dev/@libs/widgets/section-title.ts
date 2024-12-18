import { type Component, m } from "@maya/core";
import { derived, dstr, type MaybeSignal, val } from "@maya/signal";
import { Icon } from "../ui-kit/icon";

type SectionTitleProps = {
  classNames?: string;
  iconName?: string;
  label: string;
};

export const SectionTitle: Component<SectionTitleProps> = ({
  classNames,
  iconName,
  label,
}) =>
  m.H2({
    class: dstr`flex items-center mid-gray ${classNames}`,
    children: [
      m.If({
        condition: derived(() => !!val(iconName)),
        then: () =>
          Icon({
            size: 28,
            className: "b mr3",
            iconName: iconName as MaybeSignal<string>,
          }),
      }),
      label,
    ],
  });
