import { component, m } from "@mufw/maya";
import { derived, dstring, type Signal, val } from "@cyftech/signal";
import { Icon } from "./icon";

type TagProps = {
  classNames?: string;
  isHighlighted?: boolean;
  label: string;
  iconClassNames?: string;
  iconName?: string;
  iconHint?: string;
  iconSize?: number;
  onClick?: () => void;
  onIconClick?: () => void;
};

export const Tag = component<TagProps>(
  ({
    classNames,
    isHighlighted,
    label,
    iconClassNames,
    iconName,
    iconHint,
    iconSize,
    onClick,
    onIconClick,
  }) =>
    m.Span({
      class: dstring`ba br2 flex items-center ${() =>
        isHighlighted?.value
          ? "bg-light-gray b--moon-gray"
          : "bg-near-white b--transparent"} ${classNames}`,
      onclick: onClick,
      children: [
        m.Span(label),
        m.If({
          subject: iconName,
          isTruthy: Icon({
            className: dstring`pointer mid-gray ${iconClassNames}`,
            size: derived(() => iconSize?.value || 16),
            onClick: onIconClick,
            iconName: iconName as Signal<string>,
            title: iconHint,
          }),
        }),
      ],
    })
);
