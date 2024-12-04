import { component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type ButtonProps = {
  className?: string;
  label: string;
  onTap: () => void;
};

export const Button = component<ButtonProps>(({ className, onTap, label }) =>
  m.Button({
    class: dstr`pv2 ph3 br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${className}`,
    onclick: onTap,
    children: m.Text(label),
  })
);
