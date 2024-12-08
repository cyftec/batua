import { Component, m, Child } from "@maya/core";
import { TileCard } from "./tile-card";
import { Icon } from "../ui-kit";
import { derived, MaybeSignal, val } from "@maya/signal";

type ListTileProps = {
  classNames?: string;
  titleIconName?: string;
  title: string;
  subtitle: string;
  child: Child;
};

export const ListTile: Component<ListTileProps> = ({
  classNames,
  titleIconName,
  title,
  subtitle,
  child,
}) =>
  TileCard({
    classNames: classNames,
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
