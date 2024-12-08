import { Component, m } from "@maya/core";
import { dstr } from "@maya/signal";
import { Icon } from "../ui-kit";
import { TileCard } from ".";

type AddButtonTileProps = {
  classNames?: string;
  label: string;
  onClick: () => void;
};

export const AddButtonTile: Component<AddButtonTileProps> = ({
  classNames,
  label,
  onClick,
}) =>
  TileCard({
    classNames: dstr`tc pointer ${classNames}`,
    onClick: onClick,
    children: [
      Icon({
        className: "mb2",
        size: 42,
        iconName: "add",
      }),
      m.Div({
        class: "light-silver f6",
        children: label,
      }),
    ],
  });
