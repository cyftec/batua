import { createDb } from "../../../_kvdb";
import {
  AccountRaw,
  Account,
  PaymentRaw,
  PaymentMethodRaw,
  PaymentMethod,
  Payment,
  TagRaw,
  Tag,
  TxnRaw,
  TitleRaw,
  Title,
  Txn,
  BudgetRaw,
  Budget,
} from "../../../models/core";

const PAYMENT_METHODS_TABLE_KEY = "pm";
const ACCOUNTS_TABLE_KEY = "a";
const PAYMENTS_TABLE_KEY = "p";
const TAGS_TABLE_KEY = "tg";
const TITLES_TABLE_KEY = "tt";
const TRANSACTIONS_TABLE_KEY = "t";
const BUDGETS_TABLE_KEY = "b";

export const dbschema = {
  paymentMethods: {
    key: PAYMENT_METHODS_TABLE_KEY,
    structure: [{} as PaymentMethodRaw, {} as PaymentMethod],
    foreignKeyMappings: {},
  },
  accounts: {
    key: ACCOUNTS_TABLE_KEY,
    structure: [{} as AccountRaw, {} as Account],
    foreignKeyMappings: { paymentMethods: PAYMENT_METHODS_TABLE_KEY },
  },
  payments: {
    key: PAYMENTS_TABLE_KEY,
    structure: [{} as PaymentRaw, {} as Payment],
    foreignKeyMappings: {
      account: ACCOUNTS_TABLE_KEY,
      via: PAYMENT_METHODS_TABLE_KEY,
    },
  },
  tags: {
    key: TAGS_TABLE_KEY,
    structure: ["" as TagRaw, {} as Tag],
    foreignKeyMappings: {},
  },
  titles: {
    key: TITLES_TABLE_KEY,
    structure: ["" as TitleRaw, {} as Title],
    foreignKeyMappings: {},
  },
  txns: {
    key: TRANSACTIONS_TABLE_KEY,
    structure: [{} as TxnRaw, {} as Txn],
    foreignKeyMappings: {
      tags: TAGS_TABLE_KEY,
      title: TITLES_TABLE_KEY,
      payments: PAYMENTS_TABLE_KEY,
    },
    dbToJsTypeMappings: { date: "Date", created: "Date", modified: "Date" },
  },
  budgets: {
    key: BUDGETS_TABLE_KEY,
    structure: [{} as BudgetRaw, {} as Budget],
    foreignKeyMappings: {
      oneOf: TAGS_TABLE_KEY,
      allOf: TAGS_TABLE_KEY,
    },
  },
} as const;

export const db = createDb(dbschema);
