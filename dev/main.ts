import { m } from "@maya/core";
import { Page } from "./@libs/ui-kit";

export default () =>
  Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Home Page",
    content: m.Div([m.H3("home page stuff"), m.Span("Go to transactions")]),
  });
