import { createDb } from "../../../kvdb";
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

const PAYMENT_METHODS_TABLE_KEY = "pm";
const ACCOUNTS_TABLE_KEY = "a";
const PAYMENTS_TABLE_KEY = "p";
const TAGS_TABLE_KEY = "tg";
const TRANSACTION_TITLES_TABLE_KEY = "tt";
const TRANSACTIONS_TABLE_KEY = "t";

export const dbschema = {
  paymentMethods: {
    key: PAYMENT_METHODS_TABLE_KEY,
    structure: [{} as PaymentMethod, {} as PaymentMethodUI],
    foreignKeyMappings: {},
  },
  accounts: {
    key: ACCOUNTS_TABLE_KEY,
    structure: [{} as Account, {} as AccountUI],
    foreignKeyMappings: { paymentMethods: PAYMENT_METHODS_TABLE_KEY },
  },
  payments: {
    key: PAYMENTS_TABLE_KEY,
    structure: [{} as Payment, {} as PaymentUI],
    foreignKeyMappings: {
      accounts: ACCOUNTS_TABLE_KEY,
      via: PAYMENT_METHODS_TABLE_KEY,
    },
  },
  tags: {
    key: TAGS_TABLE_KEY,
    structure: ["" as Tag, {} as TagUI],
    foreignKeyMappings: {},
  },
  txnTitles: {
    key: TRANSACTION_TITLES_TABLE_KEY,
    structure: ["" as TxnTitle, {} as TxnTitleUI],
    foreignKeyMappings: {},
  },
  txns: {
    key: TRANSACTIONS_TABLE_KEY,
    structure: [{} as Txn, {} as TxnUI],
    foreignKeyMappings: {
      tags: TAGS_TABLE_KEY,
      title: TRANSACTION_TITLES_TABLE_KEY,
      payments: PAYMENTS_TABLE_KEY,
    },
    dbToJsTypeMappings: { date: "Date", created: "Date", modified: "Date" },
  },
} as const;

export const db = createDb(dbschema);
