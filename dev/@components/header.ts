import { Component, m } from "@maya/core";

type HeaderProps = {
  title: string;
};

export const Header = Component<HeaderProps>(({ title }) =>
  m.Div({
    class: "sticky left-0 top-0 right-0 pa3 bg-white",
    children: [
      m.Div({
        class: "confined ma0 f3 b",
        children: m.Text(title),
      }),
    ],
  })
);
