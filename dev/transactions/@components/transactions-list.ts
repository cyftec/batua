import { m, component } from "@mufw/maya";
import {
  editingError,
  editableTransaction,
  isEditorOpen,
  resetEditing,
  saveTransaction,
  startEditing,
  updateEditingTransaction,
} from "../../@libs/stores/transactions";
import { Button } from "../../@libs/elements";
import { TransactionEditor } from "./transaction-editor";
import { TransactionTile } from "./transaction-tile";
import {
  allTransactions,
  getAllTransactions,
} from "../../@libs/stores/transactions/crud";
import { derived, effect, type DerivedSignal } from "@cyftech/signal";
import type { TransactionUI } from "../../@libs/common";

type TransactionsListProps = {
  classNames?: string;
};

effect(() => console.log(allTransactions.value));

export const TransactionsList = component<TransactionsListProps>(
  ({ classNames }) => {
    console.log(isEditorOpen);
    return m.Div({
      onmount: getAllTransactions,
      class: classNames,
      children: [
        Button({
          // className: "mt2",
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
          subject: allTransactions,
          isTruthy: m.Div(
            m.For({
              subject: derived(() => {
                const allTxns =
                  (allTransactions as DerivedSignal<TransactionUI[]>).value ||
                  [];
                return [
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                  ...allTxns,
                ];
              }),
              map: (txn) => {
                return TransactionTile({
                  className: "mt3",
                  transaction: txn,
                  onClick: () => startEditing(txn),
                });
              },
            })
          ),
        }),
      ],
    });
  }
);
