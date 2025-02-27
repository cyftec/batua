import { dpromise } from "@cyftech/signal";
import { phase } from "@mufw/maya/utils";
import type { Transaction, TransactionUI } from "../../../@libs/common";
import { db } from "../../storage/localdb/setup";
import { getAllPayments, payments } from "../payments";

const [getAllTransactions, allTransactions] = dpromise(async () => {
  console.log(`fetching all transactions`);
  const txns = await db.transactions.getAll();
  if (!payments.value) await getAllPayments();
  const txnsWithPayments: TransactionUI[] = txns.map((txn) => {
    const plist = payments.value?.filter((p) => txn.payments.includes(p.id));
    if (!plist?.length) throw `no payments found for '${txn.title}'`;
    return { ...txn, payments: plist };
  });

  console.log(txnsWithPayments);
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

if (!phase.currentIs("build")) getAllTransactions();

export {
  addTransaction,
  allTransactions,
  deleteTransaction,
  getAllTransactions,
  updateTransaction,
};
