import { type Child, component, m } from "@mufw/maya";
import { derived, type MaybeSignal, val } from "@cyftech/signal";
import { Icon } from "../elements";
import { TileCard } from "./tile-card";

type ListTileProps = {
  classNames?: string;
  titleIconName?: string;
  title: string;
  subtitle: string;
  child: Child;
  onClick?: () => void;
};

export const ListTile = component<ListTileProps>(
  ({ classNames, titleIconName, title, subtitle, child, onClick }) =>
    TileCard({
      classNames: classNames,
      onClick,
      children: [
        m.Div({
          class: "black b mb1 flex items-center",
          children: [
            m.If({
              subject: titleIconName,
              isTruthy: Icon({
                size: 20,
                className: "b mr2",
                iconName: titleIconName as MaybeSignal<string>,
              }),
            }),
            title.value,
          ],
        }),
        m.Div({
          class: "light-silver h1 f6",
          children: subtitle,
        }),
        child,
      ],
    })
);
