import { component, m } from "@mufw/maya";
import { derived, dstring, type Signal, val } from "@cyftech/signal";
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

export const Tag = component<TagProps>(
  ({
    classNames,
    label,
    iconClassNames,
    iconName,
    iconHint,
    iconSize,
    onIconClick,
  }) =>
    m.Span({
      class: dstring`bg-near-white br2 flex items-center ${classNames}`,
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
