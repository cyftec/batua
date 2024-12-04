import { Children, component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type TileCardProps = {
  classNames?: string;
  onClick?: () => void;
  children: Children;
};

export const TileCard = component<TileCardProps>(
  ({ classNames, onClick, children }) =>
    m.Div({
      class: dstr`bg-almost-white br4 pa3 mb4 mr4 w-45 ${classNames}`,
      onclick: onClick,
      children,
    })
);
