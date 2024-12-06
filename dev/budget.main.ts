import { m } from "@maya/core";
import { Page } from "./@libs/ui-kit";

export default () =>
  Page({
    title: "Batua | Budget & Earnings",
    headerTitle: "Create budget based on earnings",
    scriptSrcPrefix: "budget.",
    selectedTabIndex: 2,
    content: m.Span({
      children: `Sed ut perspiciatis`,
    }),
  });
