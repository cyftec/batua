import { pathname } from "../@libs/common";
import { Page } from "../@libs/widgets";
import { Summary, TransactionsList } from "./@components";

export default () => {
  return Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Transactions List",
    selectedTabIndex: 0,
    mainContent: TransactionsList({ classNames: "fg3" }),
    sideContent: Summary({
      className: "sticky top-4 right-0 bottom-0 fg2",
      title: "October 2024",
      amount: "48,513.56",
      onAddTransaction: () => (window.location.href = pathname("/charts.html")),
    }),
  });
};
