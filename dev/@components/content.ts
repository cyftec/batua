import { drstr, m, Node, Signal } from "@maya/core";

type ContentProps = {
  classNames?: Signal<string>;
  children: Node[];
};

export const Content = ({ children, classNames }: ContentProps) =>
  m.Div({
    class: drstr`pa3 ${classNames}`,
    children,
  });
