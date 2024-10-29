import { m } from "@maya/core";

export const Header = () =>
  m.Div({
    class: "pv4 ph3",
    children: [
      m.H1({
        class: "ma0",
        children: m.Text("Expenses"),
      }),
    ],
  });
