import { Component, m } from "@maya/core";
import { dstr, val } from "@maya/signal";

type IconProps = {
  className?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon: Component<IconProps> = ({
  className,
  size,
  onClick,
  iconName,
  title,
}) =>
  m.Span({
    class: dstr`material-symbols-rounded ${() =>
      !!onClick ? "pointer" : ""} ${className}`,
    style: dstr`font-size: ${() => val(size) || "16"}px`,
    onclick: onClick,
    children: iconName,
    title: val(title) || "",
  });
