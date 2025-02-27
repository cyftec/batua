import { component, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";

type LinkProps = {
  className?: string;
  label: string;
  onClick: () => void;
};

export const Link = component<LinkProps>(({ className, onClick, label }) =>
  m.Span({
    class: dstring`underline pointer hover-black f6 ${className}`,
    onclick: onClick,
    children: label,
  })
);
