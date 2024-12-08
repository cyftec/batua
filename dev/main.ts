import { m } from "@maya/core";
import { Button } from "./@libs/ui-kit";
import { Page } from "./@libs/widgets";
import { path } from "./@libs/common";

export default () =>
  Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Home Page",
    mainContent: m.Div([
      m.H3("home page stuff"),
      Button({
        label: "Go to transactions",
        onTap: () => (location.href = path("/transactions")),
      }),
    ]),
    sideContent: "",
  });
