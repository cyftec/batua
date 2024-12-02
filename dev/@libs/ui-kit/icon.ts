import { Component, drstr, m } from "@maya/core";

type IconProps = {
  className?: string;
  style?: string;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = Component<IconProps>(
  ({ className, style, onClick, iconName, title }) =>
    m.Span({
      class: drstr`material-symbols-rounded ${className}`,
      style: style,
      onclick: onClick,
      children: m.Text(iconName),
      title,
    })
);
