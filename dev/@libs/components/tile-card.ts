import { type Children, component, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";

type TileCardProps = {
  classNames?: string;
  onClick?: () => void;
  children: Children;
};

export const TileCard = component<TileCardProps>(
  ({ classNames, onClick, children }) =>
    m.Div({
      class: dstring`br4 ph3 pt3 pb0 ${
        onClick ? "hover-pop pointer" : ""
      } ${classNames}`,
      onclick: onClick,
      children,
    })
);
