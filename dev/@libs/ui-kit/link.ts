import { Component, drstr, m } from "@maya/core";

type LinkProps = {
  className?: string;
  label: string;
  onClick: () => void;
};

export const Link = Component<LinkProps>(({ className, onClick, label }) =>
  m.Span({
    class: drstr`underline pointer hover-black f6 ${className}`,
    onclick: onClick,
    children: m.Text(label),
  })
);
