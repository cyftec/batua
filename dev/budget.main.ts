import { m } from "@maya/core";
import { Page } from "./@libs/widgets";

export default () =>
  Page({
    title: "Batua | Budget & Earnings",
    headerTitle: "Create budget based on earnings",
    scriptSrcPrefix: "budget.",
    selectedTabIndex: 2,
    mainContent: m.Span(`Sed ut perspiciatis`),
    sideContent: "",
  });
