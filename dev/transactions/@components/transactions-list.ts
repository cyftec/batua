import { signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import type { TransactionUI } from "../../@libs/common";
import { Button } from "../../@libs/elements";
import { TransactionEditor } from "./transaction-editor";
import { TransactionTile } from "./transaction-tile";
import { allTransactions } from "../../@libs/stores/transactions";

type TransactionsListProps = {
  classNames?: string;
};

export const TransactionsList = component<TransactionsListProps>(
  ({ classNames }) => {
    const isEditorOpen = signal(false);
    const editableTransaction = signal<TransactionUI | undefined>(undefined);

    const openEditor = (editableTxn?: TransactionUI) => {
      editableTransaction.value = editableTxn;
      isEditorOpen.value = true;
    };

    const closeEditor = () => {
      editableTransaction.value = undefined;
      isEditorOpen.value = false;
    };

    return m.Div({
      class: classNames,
      children: [
        Button({
          label: "Add new transaction",
          onTap: () => openEditor(),
        }),
        TransactionEditor({
          isOpen: isEditorOpen,
          editableTransaction: editableTransaction,
          onCancel: closeEditor,
          onDone: closeEditor,
        }),
        m.Div(
          m.For({
            subject: allTransactions,
            map: (txn) => {
              return TransactionTile({
                className: "mt3",
                transaction: txn,
                onClick: () => openEditor(txn),
              });
            },
          })
        ),
      ],
    });
  }
);
