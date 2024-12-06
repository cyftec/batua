import { Component, m, Child } from "@maya/core";
import { TileCard } from "./tile-card";

type ListTileProps = {
  classNames?: string;
  title: string;
  subtitle: string;
  child: Child;
};

export const ListTile: Component<ListTileProps> = ({
  classNames,
  title,
  subtitle,
  child,
}) =>
  TileCard({
    classNames: classNames,
    children: [
      m.Div({
        class: "black b mb1",
        children: title,
      }),
      m.Div({
        class: "light-silver h1 f6",
        children: subtitle,
      }),
      child,
    ],
  });
