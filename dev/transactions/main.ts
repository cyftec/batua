import { m } from "@maya/core";
import { source } from "@maya/signal";
import { Page } from "../@libs/widgets";

import { Summary, TransactionEditor, TransactionTile } from "./@components";

export default () => {
  const isTransactionEditorOpen = source(false);
  const toggleTransactionEditorDIalog = () =>
    (isTransactionEditorOpen.value = !isTransactionEditorOpen.value);

  return Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Transactions List",
    selectedTabIndex: 0,
    mainContent: m.Div({
      class: "fg3",
      children: m.For({
        items: source(
          Array(30).fill({
            amount: "183.50",
            title: "Paneer biryani from Swiggy",
            date: new Date(),
            tags: [
              "eatingout",
              "swiggy",
              "luxary",
              "eatingout",
              "swiggy",
              "luxary",
              "eatingout",
              "swiggy",
              "luxary",
            ],
            paymentMethod: "Bhim UPI",
          })
        ),
        map: (transaction) =>
          TransactionTile({
            className: "mb4 pb4",
            amount: transaction.amount,
            title: transaction.title,
            date: transaction.date,
            tags: transaction.tags,
            paymentMethod: transaction.paymentMethod,
          }),
      }),
    }),
    sideContent: [
      TransactionEditor({
        isOpen: isTransactionEditorOpen,
        onCancel: () => (isTransactionEditorOpen.value = false),
        onSave: (transaction) => {
          console.log(transaction);
          isTransactionEditorOpen.value = false;
        },
      }),
      Summary({
        className: "sticky top-4 right-0 bottom-0 fg2",
        title: "October 2024",
        amount: "48,513.56",
        onAddTransaction: toggleTransactionEditorDIalog,
      }),
    ],
  });
};
