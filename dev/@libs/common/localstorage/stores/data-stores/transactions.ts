import {
  getTypeData,
  ID,
  Payment,
  PaymentUI,
  TagUI,
  Transaction,
  TRANSACTION_TYPE,
  TransactionUI,
} from "../../../models/core";
import { getStore, parseObjectJsonString } from "../../core";
import { PREFIX } from "./common";
import { paymentsStore } from "./payments";
import { tagsStore } from "./tags";
import { txnTitlesStore } from "./transaction-titles";

const lsValueToTxn = (lsValueString: string | null): Transaction | undefined =>
  parseObjectJsonString<Transaction>(lsValueString, "modifiedAt");
const txnToLsValue = (txn: Transaction): string => JSON.stringify(txn);
const txnToTxnUI = (id: ID, txn: Transaction): TransactionUI => {
  const payments: PaymentUI[] = paymentsStore.getAll(txn.payments);
  if (!payments.length)
    throw `Payments not found for these payment-ids - '${txn.payments}'`;
  const tags: TagUI[] = tagsStore.getAll(txn.tags);
  if (!tags.length) throw `Tags not found for these tag-ids - '${txn.tags}'`;
  const title = txnTitlesStore.get(txn.title);
  if (!title) throw `Title not found for title-id - '${txn.title}'`;
  const txnUI: TransactionUI = {
    ...txn,
    id,
    payments,
    tags,
    title,
    type: getTypeData(TRANSACTION_TYPE, txn.type),
  };
  return txnUI;
};
const txnUiToTxn = (txnUI: TransactionUI): Transaction => {
  const txnRecord: Transaction = {
    ...txnUI,
    payments: txnUI.payments.map((p) => p.id),
    tags: txnUI.tags.map((t) => t.id),
    title: txnUI.title.id,
    type: txnUI.type.key,
  };
  delete txnRecord["id"];
  return txnRecord;
};

export const txnsStore = getStore<Transaction, TransactionUI>(
  PREFIX.TRANSACTION,
  lsValueToTxn,
  txnToLsValue,
  txnToTxnUI,
  txnUiToTxn
);
