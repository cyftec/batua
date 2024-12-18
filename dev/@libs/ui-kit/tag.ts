import { type Component, m } from "@maya/core";
import { derived, dstr, type Signal, val } from "@maya/signal";
import { Icon } from "./icon";

type TagProps = {
  classNames?: string;
  label: string;
  iconClassNames?: string;
  iconName?: string;
  iconHint?: string;
  iconSize?: number;
  onIconClick?: () => void;
};

export const Tag: Component<TagProps> = ({
  classNames,
  label,
  iconClassNames,
  iconName,
  iconHint,
  iconSize,
  onIconClick,
}) =>
  m.Span({
    class: dstr`bg-near-white br2 flex items-center ${classNames}`,
    children: [
      m.Span(label),
      m.If({
        condition: derived(() => !!val(iconName)),
        then: () =>
          Icon({
            className: dstr`pointer silver ${iconClassNames}`,
            size: derived(() => val(iconSize) || 16),
            onClick: onIconClick,
            iconName: iconName as Signal<string>,
            title: iconHint,
          }),
      }),
    ],
  });
