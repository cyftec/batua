import { derived, effect, type DerivedSignal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import type { TransactionUI } from "../../@libs/common";
import { Button } from "../../@libs/elements";
import {
  editableTransaction,
  editingError,
  isEditorOpen,
  resetEditing,
  saveTransaction,
  startEditing,
  updateEditingTransaction,
} from "../../@libs/stores/transactions";
import { allTransactions } from "../../@libs/stores/transactions/crud";
import { TransactionEditor } from "./transaction-editor";
import { TransactionTile } from "./transaction-tile";

type TransactionsListProps = {
  classNames?: string;
};

export const TransactionsList = component<TransactionsListProps>(
  ({ classNames }) => {
    console.log(isEditorOpen);

    return m.Div({
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
          subject: allTransactions,
          isTruthy: m.Div(
            m.For({
              subject: allTransactions,
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
