import { m } from "@maya/core";
import { Page } from "./@libs/ui-kit";

export default () =>
  Page({
    title: "Batua | Settings",
    headerTitle: "Settings",
    scriptSrcPrefix: "settings.",
    selectedTabIndex: 5,
    content: m.Span({
      children: `Sed ut perspiciatis, `,
    }),
  });
