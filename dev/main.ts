import { m } from "@maya/core";
import { Page } from "./@components";

export default () =>
  Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Home Page",
    content: m.Div({
      children: [
        m.H3({ children: m.Text("home page stuff") }),
        m.Span({
          children: m.Text(`Go to expenses`),
        }),
      ],
    }),
  });
