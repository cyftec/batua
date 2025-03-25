import { derived, dpromise } from "@cyftech/signal";
import { phase } from "@mufw/maya/utils";
import type { ID, TransactionDB, TransactionUI } from "../common";
import { db } from "../storage/localdb/setup";
import {
  fetchAllPayments,
  allPayments,
  addPayment,
  findPayment,
  updatePayment,
  deletePayment,
} from "./payments";
import { addTag, allTags, fetchAllTags, findTag } from "./tags";

const [fetchAllTransactions, txnsList] = dpromise(async () => {
  const txns = await db.transactions.getAll();
  if (!allPayments.value.length) await fetchAllPayments();
  console.log(`fetched all payments`, allPayments.value);
  if (!allTags.value.length) await fetchAllTags();
  console.log(`fetched all tags`, allTags.value);
  const txnsWithPayments: TransactionUI[] = txns.map((txn) => {
    const plist = allPayments.value?.filter((p) => txn.payments.includes(p.id));
    const tagsList = allTags.value?.filter((t) => txn.tags.includes(t.id));
    return { ...txn, payments: plist, tags: tagsList };
  });
  console.log(`fetched all transactions`, txnsWithPayments);

  return txnsWithPayments;
});

const allTransactions = derived(() => txnsList.value || []);

const addTransaction = async (transaction: TransactionUI) => {
  for await (const tag of transaction.tags) {
    if (await findTag(tag.id)) continue;
    await addTag(tag);
  }
  for await (const p of transaction.payments) {
    await addPayment(p);
  }
  const txn: TransactionDB = {
    ...transaction,
    tags: transaction.tags.map((tag) => tag.id),
    payments: transaction.payments.map((p) => p.id),
  };
  await db.transactions.add(txn);
  await fetchAllTransactions();
};

const updateTransaction = async (transaction: TransactionUI) => {
  for await (const tag of transaction.tags) {
    if (await findTag(tag.id)) continue;
    await addTag(tag);
  }
  for await (const p of transaction.payments) {
    if (await findPayment(p.id)) {
      await updatePayment(p);
    } else await addPayment(p);
  }
  const txn: TransactionDB = {
    ...transaction,
    tags: transaction.tags.map((tag) => tag.id),
    payments: transaction.payments.map((p) => p.id),
  };
  await db.transactions.put(txn);
  await fetchAllTransactions();
};

const deleteTransaction = async (transaction: TransactionUI) => {
  for await (const p of transaction.payments) {
    if (await findPayment(p.id)) {
      await deletePayment(p);
    }
  }
  await db.transactions.delete(transaction.id);
  await fetchAllTransactions();
};

export {
  addTransaction,
  allTransactions,
  deleteTransaction,
  fetchAllTransactions,
  updateTransaction,
};
