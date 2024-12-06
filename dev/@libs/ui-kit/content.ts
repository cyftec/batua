import { ChildrenProp, Component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type ContentProps = {
  classNames?: string;
  children: ChildrenProp;
};

export const Content: Component<ContentProps> = ({ classNames, children }) =>
  m.Div({
    class: dstr`${classNames}`,
    children,
  });
