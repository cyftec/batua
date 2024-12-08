import { m } from "@maya/core";
import { Page } from "./@libs/widgets";

export default () =>
  Page({
    title: "Batua | Charts & Trends",
    headerTitle: "Charts & Trends",
    scriptSrcPrefix: "charts.",
    selectedTabIndex: 1,
    mainContent: m.Span(`Sed ut perspiciatis`),
    sideContent: "",
  });
