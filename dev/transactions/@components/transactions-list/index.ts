import { component, m } from "@mufw/maya";
import type { TransactionUI } from "../../../@libs/common";
import { allTransactions } from "../../../@libs/stores/transactions";
import { TransactionTile } from "./transaction-tile";
import { effect } from "@cyftech/signal";

type TransactionsListProps = {
  classNames?: string;
  onTransactionEdit: (transaction: TransactionUI) => void;
};

export const TransactionsList = component<TransactionsListProps>(
  ({ classNames, onTransactionEdit }) => {
    effect(() => console.log(allTransactions.value));
    return m.Div({
      children: [
        m.Div({
          class: classNames,
          children: m.For({
            subject: allTransactions,
            map: (txn) => {
              return TransactionTile({
                className: "mt3",
                transaction: txn,
                onClick: () => onTransactionEdit(txn),
              });
            },
          }),
        }),
      ],
    });
  }
);
