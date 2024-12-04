import { Component, m } from "@maya/core";
import { drstr } from "@maya/signal";

type ButtonProps = {
  className?: string;
  label: string;
  onTap: () => void;
};

export const Button = Component<ButtonProps>(({ className, onTap, label }) =>
  m.Button({
    class: drstr`pv2 ph3 br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${className}`,
    onclick: onTap,
    children: m.Text(label),
  })
);
