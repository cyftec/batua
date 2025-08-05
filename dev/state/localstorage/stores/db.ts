import { createDb, unstructuredValue } from "../../../_kvdb";
import {
  Account,
  Budget,
  Payment,
  PaymentMethod,
  Tag,
  Title,
  Txn,
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
    structure: {} as PaymentMethod,
    unstructured: false,
    foreignKeyMappings: {},
  },
  accounts: {
    key: ACCOUNTS_TABLE_KEY,
    structure: {} as Account,
    unstructured: false,
    foreignKeyMappings: { paymentMethods: PAYMENT_METHODS_TABLE_KEY },
  },
  payments: {
    key: PAYMENTS_TABLE_KEY,
    structure: {} as Payment,
    unstructured: false,
    foreignKeyMappings: {
      account: ACCOUNTS_TABLE_KEY,
      via: PAYMENT_METHODS_TABLE_KEY,
    },
  },
  tags: {
    key: TAGS_TABLE_KEY,
    structure: {} as Tag,
    unstructured: true,
    foreignKeyMappings: {},
  },
  titles: {
    key: TITLES_TABLE_KEY,
    structure: {} as Title,
    unstructured: true,
    foreignKeyMappings: {},
  },
  txns: {
    key: TRANSACTIONS_TABLE_KEY,
    structure: {} as Txn,
    unstructured: false,
    foreignKeyMappings: {
      tags: TAGS_TABLE_KEY,
      title: TITLES_TABLE_KEY,
      payments: PAYMENTS_TABLE_KEY,
    },
    dbToJsTypeMappings: { date: "Date", created: "Date", modified: "Date" },
  },
  budgets: {
    key: BUDGETS_TABLE_KEY,
    structure: {} as Budget,
    unstructured: false,
    foreignKeyMappings: {
      oneOf: TAGS_TABLE_KEY,
      allOf: TAGS_TABLE_KEY,
    },
  },
} as const;

export const db = createDb(dbschema);
