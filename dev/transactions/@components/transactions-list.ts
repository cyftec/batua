import { m, type Component } from "@maya/core";
import {
  editingError,
  editableTransaction,
  isEditorOpen,
  resetEditing,
  saveTransaction,
  startEditing,
  updateEditingTransaction,
} from "../../@libs/stores/transactions";
import { Button } from "../../@libs/ui-kit";
import { TransactionEditor } from "./transaction-editor";
import { TransactionTile } from "./transaction-tile";
import {
  allTransactions,
  getAllTransactions,
} from "../../@libs/stores/transactions/crud";
import type { DerivedSignal } from "@maya/signal";
import type { TransactionUI } from "../../@libs/common";

type TransactionsListProps = {
  classNames?: string;
};

export const TransactionsList: Component<TransactionsListProps> = ({
  classNames,
}) => {
  console.log(isEditorOpen);
  return m.Div({
    onmount: getAllTransactions,
    class: classNames,
    children: [
      Button({
        label: "Add new transaction",
        onTap: startEditing,
      }),
      TransactionEditor({
        isOpen: isEditorOpen,
        editableTransaction: editableTransaction,
        onChange: updateEditingTransaction,
        onCancel: resetEditing,
        onSave: saveTransaction,
        error: editingError,
      }),
      m.If({
        condition: allTransactions,
        then: () =>
          m.Div(
            m.For({
              items: allTransactions as DerivedSignal<TransactionUI[]>,
              map: (txn) => {
                return TransactionTile({
                  className: "mt4",
                  transaction: txn,
                  onClick: () => startEditing(txn),
                });
              },
            })
          ),
      }),
    ],
  });
};
