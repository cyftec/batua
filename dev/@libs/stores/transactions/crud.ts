import { dpromise } from "@maya/signal";
import { db } from "../../storage/localdb/setup";
import type { Transaction, TransactionUI } from "../../../@libs/common";
import { getAllPayments, payments } from "../payments";
import { phases } from "@maya/core";

const [getAllTransactions, allTransactions] = dpromise(async () => {
  const txns = await db.transactions.getAll();
  if (!payments.value) await getAllPayments();
  const txnsWithPayments: TransactionUI[] = txns.map((txn) => {
    const plist = payments.value?.filter((p) => txn.payments.includes(p.id));
    if (!plist?.length) throw `no payments found for '${txn.title}'`;
    return { ...txn, payments: plist };
  });

  return txnsWithPayments;
});

const [addTransaction] = dpromise(async (transaction: Transaction) => {
  await db.transactions.add(transaction);
  await getAllTransactions();
});

const [updateTransaction] = dpromise(async (transaction: Transaction) => {
  await db.transactions.put(transaction);
  await getAllTransactions();
});

const [deleteTransaction] = dpromise(
  async (transactionId: Transaction["id"]) => {
    await db.transactions.delete(transactionId);
    await getAllTransactions();
  }
);

if (!phases.value.htmlBuildPhase) getAllTransactions();

export {
  allTransactions,
  getAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
