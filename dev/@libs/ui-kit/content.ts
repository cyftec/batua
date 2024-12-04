import { Component, drstr, m, Node } from "@maya/core";

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
