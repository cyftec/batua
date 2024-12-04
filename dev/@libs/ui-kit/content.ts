import { component, m, Node } from "@maya/core";
import { dstr } from "@maya/signal";

type ContentProps = {
  classNames?: string;
  children: Node[];
};

export const Content = component<ContentProps>(({ children, classNames }) =>
  m.Div({
    class: dstr`${classNames}`,
    children,
  })
);
