import { derived, source } from "@maya/signal";
import { STORAGE } from "../../../@libs/storage";
import {
  getDiffDaysFromToday,
  type ID,
  type Payment,
  type TransactionUI,
} from "../../common";
import { addTransaction, updateTransaction } from "./crud";

const newTransactionId = crypto.randomUUID();
const newPayment = (): Payment => ({
  id: crypto.randomUUID(),
  amount: 0,
  transactionId: newTransactionId,
  currencyCode: STORAGE.prefs.localCurrency.value,
  account: "" as ID,
  paymentMethod: "" as ID,
  type: "debit",
});
const newTransaction = (): TransactionUI => ({
  id: newTransactionId,
  date: new Date(),
  createdAt: new Date(),
  modifiedAt: new Date(),
  title: "",
  tags: [],
  type: "purchase",
  payments: [newPayment()],
});

export const isEditorOpen = source(false);
export const isEditingNewTransaction = source(true);
const editingTransaction = source<TransactionUI>(newTransaction());
export const editableTransaction = derived(() => editingTransaction.value);
export const editingError = source<string>("");

const validateTransaction = () => {
  editingError.value = "";

  if (getDiffDaysFromToday(editingTransaction.value.date).isFuture) {
    editingError.value = "Date of transaction is in future.";
    return;
  }

  if (!editingTransaction.value.title) {
    editingError.value = "Title is empty.";
    return;
  }

  if (!editingTransaction.value.tags.length) {
    editingError.value = "Tags are not added.";
    return;
  }

  if (editingTransaction.value.payments.some((p) => p.amount === 0)) {
    editingError.value = "Paid amount is 0 in payments section.";
    return;
  }

  if (
    editingTransaction.value.payments.some((p, i) =>
      editingTransaction.value.payments.some(
        (pm, idx) => i !== idx && p.paymentMethod === pm.paymentMethod
      )
    )
  ) {
    editingError.value = "Duplicate payment methods in payments section.";
    return;
  }

  console.log("NO ERROR FOUND");
};

export const startEditing = (transaction?: TransactionUI) => {
  isEditingNewTransaction.value = !transaction;
  if (transaction) editingTransaction.value = transaction;
  isEditorOpen.value = true;
  console.log(transaction);
  console.log(`startEditing done`);
};

export const resetEditing = () => {
  editingError.value = "";
  isEditingNewTransaction.value = true;
  editingTransaction.value = newTransaction();
  isEditorOpen.value = false;
};

export const saveTransaction = async () => {
  validateTransaction();
  if (editingError.value) return;

  const isNew = isEditingNewTransaction.value;
  const txn = editingTransaction.value;
  if (isNew) {
    addTransaction({
      ...txn,
      payments: txn.payments.map((p) => p.id),
    });
    // for (const p of txn.payments) {
    //   await addPayment(p);
    // }
  } else {
    updateTransaction({
      ...txn,
      payments: txn.payments.map((p) => p.id),
    });
    // for (const p of txn.payments) {
    //   await updatePayment(p);
    // }
  }

  console.log(editingTransaction.value);
  resetEditing();
};

export const updateEditingTransaction = (transaction: TransactionUI) =>
  (editingTransaction.value = transaction);
