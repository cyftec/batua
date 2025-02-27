import { type Children, component } from "@mufw/maya";
import { dstring } from "@cyftech/signal";
import { TileCard } from ".";

type AddButtonTileProps = {
  classNames?: string;
  onClick: () => void;
  children: Children;
};

export const AddButtonTile = component<AddButtonTileProps>(
  ({ classNames, children, onClick }) =>
    TileCard({
      classNames: dstring`tc ${classNames}`,
      onClick: onClick,
      children,
    })
);
