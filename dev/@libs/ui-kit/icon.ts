import { Component, drstr, m } from "@maya/core";

type IconProps = {
  className?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = Component<IconProps>(
  ({ className, size, onClick, iconName, title }) =>
    m.Span({
      class: drstr`material-symbols-rounded ${className}`,
      style: drstr`font-size: ${() => size?.value || "16"}px`,
      onclick: onClick,
      children: m.Text(iconName),
      title,
    })
);
