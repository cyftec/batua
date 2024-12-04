import { Component, m, Node } from "@maya/core";
import { drstr } from "@maya/signal";

type ContentProps = {
  classNames?: string;
  children: Node[];
};

export const Content = Component<ContentProps>(({ children, classNames }) =>
  m.Div({
    class: drstr`${classNames}`,
    children,
  })
);
