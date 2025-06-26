import {
  getTypeData,
  ID,
  PaymentUI,
  TagUI,
  TRANSACTION_TYPE,
  Txn,
  TxnUI,
} from "../../../models/core";
import { createStore, parseObjectJsonString } from "../../core";
import { paymentsStore } from "./payments";
import { tagsStore } from "./tags";
import { txnTitlesStore } from "./transaction-titles";

const lsValueToTxn = (lsValueString: string | null): Txn | undefined =>
  parseObjectJsonString<Txn>(lsValueString, "modifiedAt");
const txnToLsValue = (txn: Txn): string => JSON.stringify(txn);
const txnToTxnUI = (id: ID, txn: Txn): TxnUI => {
  const payments: PaymentUI[] = paymentsStore.getAll(txn.payments);
  if (!payments.length)
    throw `Payments not found for these payment-ids - '${txn.payments}'`;
  const tags: TagUI[] = tagsStore.getAll(txn.tags);
  if (!tags.length) throw `Tags not found for these tag-ids - '${txn.tags}'`;
  const title = txnTitlesStore.get(txn.title);
  if (!title) throw `Title not found for title-id - '${txn.title}'`;
  const txnUI: TxnUI = {
    ...txn,
    id,
    payments,
    tags,
    title,
    type: getTypeData(TRANSACTION_TYPE, txn.type),
  };
  return txnUI;
};
const txnUiToTxn = (txnUI: TxnUI): Txn => {
  const txnRecord: Txn = {
    ...txnUI,
    payments: txnUI.payments.map((p) => p.id),
    tags: txnUI.tags.map((t) => t.id),
    title: txnUI.title.id,
    type: txnUI.type.key,
  };
  delete txnRecord["id"];
  return txnRecord;
};

export const txnsStore = createStore<Txn, TxnUI>(
  "t_",
  lsValueToTxn,
  txnToLsValue,
  txnToTxnUI,
  txnUiToTxn
);
