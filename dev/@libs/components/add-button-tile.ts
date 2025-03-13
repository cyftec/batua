import { type Children, component } from "@mufw/maya";
import { dstring } from "@cyftech/signal";
import { TileCard } from ".";

type AddButtonTileProps = {
  classNames?: string;
  tooltip?: string;
  onClick: () => void;
  children: Children;
};

export const AddButtonTile = component<AddButtonTileProps>(
  ({ classNames, tooltip, children, onClick }) =>
    TileCard({
      classNames: dstring`tc ${classNames}`,
      tooltip: tooltip,
      onClick: onClick,
      children,
    })
);
