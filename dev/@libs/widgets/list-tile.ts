import { type Child, type Component, m } from "@maya/core";
import { derived, type MaybeSignal, val } from "@maya/signal";
import { Icon } from "../ui-kit";
import { TileCard } from "./tile-card";

type ListTileProps = {
  classNames?: string;
  titleIconName?: string;
  title: string;
  subtitle: string;
  child: Child;
  onClick?: () => void;
};

export const ListTile: Component<ListTileProps> = ({
  classNames,
  titleIconName,
  title,
  subtitle,
  child,
  onClick,
}) =>
  TileCard({
    classNames: classNames,
    onClick,
    children: [
      m.Div({
        class: "black b mb1 flex items-center",
        children: [
          m.If({
            condition: derived(() => val(titleIconName)),
            then: () =>
              Icon({
                size: 20,
                className: "b mr2",
                iconName: titleIconName as MaybeSignal<string>,
              }),
          }),
          title,
        ],
      }),
      m.Div({
        class: "light-silver h1 f6",
        children: subtitle,
      }),
      child,
    ],
  });
