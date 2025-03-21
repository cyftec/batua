import { derived, dpromise } from "@cyftech/signal";
import { phase } from "@mufw/maya/utils";
import type { ID, TransactionDB, TransactionUI } from "../common";
import { db } from "../storage/localdb/setup";
import { fetchAllPayments, allPayments } from "./payments";
import { allTags, fetchAllTags } from "./tags";

const [fetchAllTransactions, txnsList] = dpromise(async () => {
  const txns = await db.transactions.getAll();
  if (!allPayments.value.length) await fetchAllPayments();
  if (!allTags.value.length) await fetchAllTags();
  const txnsWithPayments: TransactionUI[] = txns.map((txn) => {
    const plist = allPayments.value?.filter((p) => txn.payments.includes(p.id));
    const tagsList = allTags.value?.filter((t) => txn.tags.includes(t.id));
    if (!plist?.length) throw `no payments found for '${txn.title}'`;
    return { ...txn, payments: plist, tags: tagsList };
  });

  return txnsWithPayments;
});

const allTransactions = derived(() => txnsList.value || []);

const [addTransaction] = dpromise(async (transaction: TransactionUI) => {
  const txn: TransactionDB = {
    ...transaction,
    tags: transaction.tags.map((tag) => tag.id),
    payments: transaction.payments.map((p) => p.id),
  };
  await db.transactions.add(txn);
  await fetchAllTransactions();
});

const [updateTransaction] = dpromise(async (transaction: TransactionUI) => {
  const txn: TransactionDB = {
    ...transaction,
    tags: transaction.tags.map((tag) => tag.id),
    payments: transaction.payments.map((p) => p.id),
  };
  await db.transactions.put(txn);
  await fetchAllTransactions();
});

const [deleteTransaction] = dpromise(async (transactionId: ID) => {
  await db.transactions.delete(transactionId);
  await fetchAllTransactions();
});

if (!phase.currentIs("build")) fetchAllTransactions();

export {
  addTransaction,
  allTransactions,
  deleteTransaction,
  fetchAllTransactions,
  updateTransaction,
};
