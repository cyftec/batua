import { m } from "@maya/core";
import { Page } from "./@libs/ui-kit";

export default () =>
  Page({
    title: "Batua | Charts & Trends",
    headerTitle: "Charts & Trends",
    scriptSrcPrefix: "charts.",
    selectedTabIndex: 1,
    content: m.Span(`Sed ut perspiciatis`),
  });
