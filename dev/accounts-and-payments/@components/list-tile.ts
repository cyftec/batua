import { component, m, Node } from "@maya/core";
import { TileCard } from "./tile-card";

type ListTileProps = {
  classNames?: string;
  title: string;
  subtitle: string;
  child: Node;
};

export const ListTile = component<ListTileProps>(
  ({ classNames, title, subtitle, child }) =>
    TileCard({
      classNames: classNames,
      children: [
        m.Div({
          class: "black b mb1",
          children: m.Text(title),
        }),
        m.Div({
          class: "light-silver h1 f6",
          children: m.Text(subtitle),
        }),
        child,
      ],
    })
);
