import { component, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";

type LinkProps = {
  className?: string;
  label: string;
  href?: string;
  target?: string;
  onClick?: () => void;
};

export const Link = component<LinkProps>(
  ({ className, href, target, onClick, label }) =>
    m.A({
      class: dstring`underline pointer dark-gray hover-black ${className}`,
      href,
      target,
      onclick: () => onClick && onClick(),
      children: label,
    })
);
