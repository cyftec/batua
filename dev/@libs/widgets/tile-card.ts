import { Children, Component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type TileCardProps = {
  classNames?: string;
  onClick?: () => void;
  children: Children;
};

export const TileCard: Component<TileCardProps> = ({
  classNames,
  onClick,
  children,
}) =>
  m.Div({
    class: dstr`br4 ph3 pt3 pb0 ${classNames}`,
    onclick: onClick,
    children,
  });
