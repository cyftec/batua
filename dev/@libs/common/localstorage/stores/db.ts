import { phase } from "@mufw/maya/utils";
import {
  Account,
  AccountUI,
  Payment,
  PaymentMethod,
  PaymentMethodUI,
  PaymentUI,
  Tag,
  TagUI,
  Txn,
  TxnTitle,
  TxnTitleUI,
  TxnUI,
} from "../../models/core";
import { createTable, KVStore } from "../../../kvdb";

const lsKvStore: KVStore = {
  getAllKeys: function (): string[] {
    const lsKeys: string[] = [];
    if (!phase.currentIs("run")) return lsKeys;
    for (const key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      lsKeys.push(key);
    }
    return lsKeys;
  },
  getItem: function (key: string): string | undefined {
    if (!phase.currentIs("run")) return;
    return localStorage.getItem(key) || undefined;
  },
  setItem: function (key: string, value: string): void {
    if (!phase.currentIs("run")) return;
    localStorage.setItem(key, value);
  },
  removeItem: function (key: string): void {
    if (!phase.currentIs("run")) return;
    localStorage.removeItem(key);
  },
};

const paymentMethodsTable = createTable<PaymentMethod, PaymentMethodUI>(
  lsKvStore,
  "pm"
);
const accountsTable = createTable<Account, AccountUI>(lsKvStore, "ac", {
  paymentMethods: paymentMethodsTable,
});
const paymentsTable = createTable<Payment, PaymentUI>(lsKvStore, "p", {
  account: accountsTable,
  via: paymentMethodsTable,
});
const tagsTable = createTable<Tag, TagUI>(lsKvStore, "tg");
const txnTitlesTable = createTable<TxnTitle, TxnTitleUI>(lsKvStore, "tt");
const txnsTable = createTable<Txn, TxnUI>(
  lsKvStore,
  "t",
  {
    tags: tagsTable,
    title: txnTitlesTable,
    payments: paymentsTable,
  },
  { date: "Date", created: "Date", modified: "Date" }
);

export const db = {
  paymentMethods: paymentMethodsTable,
  accounts: accountsTable,
  payments: paymentsTable,
  tags: tagsTable,
  txnTitles: txnTitlesTable,
  txns: txnsTable,
};
