import { type Children, type Component } from "@maya/core";
import { dstr } from "@maya/signal";
import { TileCard } from ".";

type AddButtonTileProps = {
  classNames?: string;
  onClick: () => void;
  children: Children;
};

export const AddButtonTile: Component<AddButtonTileProps> = ({
  classNames,
  children,
  onClick,
}) =>
  TileCard({
    classNames: dstr`tc ${classNames}`,
    onClick: onClick,
    children,
  });
