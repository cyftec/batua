import { m } from "@maya/core";
import { Page } from "./@libs/widgets";

export default () =>
  Page({
    title: "Batua | Settings",
    headerTitle: "Settings",
    scriptSrcPrefix: "settings.",
    selectedTabIndex: 5,
    mainContent: m.Span(`Sed ut perspiciatis`),
    sideContent: "",
  });
