import { component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type IconProps = {
  className?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = component<IconProps>(
  ({ className, size, onClick, iconName, title }) =>
    m.Span({
      class: dstr`material-symbols-rounded ${className}`,
      style: dstr`font-size: ${() => size?.value || "16"}px`,
      onclick: onClick,
      children: m.Text(iconName),
      title,
    })
);
