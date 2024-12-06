import { m } from "@maya/core";
import { Page } from "./@libs/ui-kit";

export default () =>
  Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Home Page",
    content: m.Div({
      children: [
        m.H3({ children: "home page stuff" }),
        m.Span({
          children: "Go to transactions",
        }),
      ],
    }),
  });
