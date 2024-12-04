import { component, m } from "@maya/core";
import { derived, dstr, Signal } from "@maya/signal";
import { Icon } from "./icon";

type TagProps = {
  classNames?: string;
  label: string;
  iconClassNames?: string;
  iconName?: string;
  iconSize?: number;
  iconHint?: string;
  onIconClick?: () => void;
};

export const Tag = component<TagProps>(
  ({
    classNames,
    label,
    iconClassNames,
    iconName,
    iconSize,
    iconHint,
    onIconClick,
  }) =>
    m.Span({
      class: dstr`bg-near-white br2 flex items-center ${classNames}`,
      children: [
        m.Span({ children: m.Text(label) }),
        m.If({
          condition: derived(() => !!iconName?.value),
          then: () =>
            Icon({
              className: dstr`pointer silver ${iconClassNames}`,
              size: derived(() => iconSize?.value || 16),
              onClick: onIconClick,
              iconName: iconName as Signal<string>,
              title: iconHint,
            }),
          otherwise: () => m.Span({ children: m.Text("") }),
        }),
      ],
    })
);
