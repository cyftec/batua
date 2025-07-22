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

export const dbschema = {
  paymentMethods: {
    key: "pm",
    structure: [{} as PaymentMethod, {} as PaymentMethodUI],
    foreignKeyMappings: {},
  },
  accounts: {
    key: "a",
    structure: [{} as Account, {} as AccountUI],
    foreignKeyMappings: { paymentMethods: "pm" },
  },
  payments: {
    key: "p",
    structure: [{} as Payment, {} as PaymentUI],
    foreignKeyMappings: { accounts: "a", via: "pm" },
  },
  tags: {
    key: "tg",
    structure: ["" as Tag, {} as TagUI],
    foreignKeyMappings: {},
  },
  txnTitles: {
    key: "tt",
    structure: ["" as TxnTitle, {} as TxnTitleUI],
    foreignKeyMappings: {},
  },
  txns: {
    key: "t",
    structure: [{} as Txn, {} as TxnUI],
    foreignKeyMappings: { tags: "tg", title: "tt", payments: "p" },
    dbToJsTypeMappings: { date: "Date", created: "Date", modified: "Date" },
  },
} as const;

export const db = createDb(dbschema);
