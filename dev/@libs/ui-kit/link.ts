import { component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type LinkProps = {
  className?: string;
  label: string;
  onClick: () => void;
};

export const Link = component<LinkProps>(({ className, onClick, label }) =>
  m.Span({
    class: dstr`underline pointer hover-black f6 ${className}`,
    onclick: onClick,
    children: m.Text(label),
  })
);
