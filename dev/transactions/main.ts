import { m } from "@maya/core";
import { signal } from "@maya/signal";
import { Page } from "../@libs/ui-kit";

import { Summary, TransactionEditor, TransactionTile } from "./@components";

export default () => {
  const isTransactionEditorOpen = signal(false);
  const toggleTransactionEditorDIalog = () =>
    (isTransactionEditorOpen.value = !isTransactionEditorOpen.value);

  return Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Transactions List",
    selectedTabIndex: 0,
    content: m.Div({
      class: "flex items-between justify-between",
      children: [
        TransactionEditor({
          isOpen: isTransactionEditorOpen,
          onCancel: () => (isTransactionEditorOpen.value = false),
          onSave: (transaction) => {
            console.log(transaction);
            isTransactionEditorOpen.value = false;
          },
        }),
        m.Div({
          children: m.For({
            items: signal(
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
        Summary({
          className: "sticky top-3 right-0 bottom-0 bg-washed-yellow",
          title: "October 2024",
          amount: "48,513.56",
          onAddTransaction: toggleTransactionEditorDIalog,
        }),
      ],
    }),
  });
};
