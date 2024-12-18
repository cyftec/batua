import { type Component, m } from "@maya/core";

type HeaderProps = {
  title: string;
};

export const Header: Component<HeaderProps> = ({ title }) =>
  m.Div({
    class: "sticky left-0 top-0 right-0 pv4 f1 fw1 black bg-white",
    children: title,
  });
