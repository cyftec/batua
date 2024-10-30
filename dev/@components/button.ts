import { derived, Component, m } from "@maya/core";

type ButtonProps = {
  label: string;
  onTap: () => void;
  className?: string;
};

export const Button = Component<ButtonProps>(({ className, onTap, label }) =>
  m.Button({
    class: derived(
      () =>
        `pv2 ph3 br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${className}`
    ),
    onclick: onTap,
    children: m.Text(label.value),
  })
);
