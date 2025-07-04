import {
  CapitalAccount,
  CapitalAccountUI,
  ExpenseAccount,
  ExpenseAccountUI,
  Payment,
  PaymentMethod,
  PaymentMethodUI,
  PaymentUI,
  PeopleOrShopAccount,
  PeopleOrShopAccountUI,
  Tag,
  TagUI,
  Txn,
  TxnTitle,
  TxnTitleUI,
  TxnUI,
} from "../../models/core";
import { createTable } from "../core";

const paymentMethodsTable = createTable<PaymentMethod, PaymentMethodUI>("pm");
const expenseAccountsTable = createTable<ExpenseAccount, ExpenseAccountUI>(
  "eac",
  { paymentMethods: paymentMethodsTable }
);
const capitalAccountsTable = createTable<CapitalAccount, CapitalAccountUI>(
  "cac"
);
const peopleOrShopAccountsTable = createTable<
  PeopleOrShopAccount,
  PeopleOrShopAccountUI
>("pac");
const paymentsTable = createTable<Payment, PaymentUI>("p", {
  account: expenseAccountsTable,
  via: paymentMethodsTable,
});
const tagsTable = createTable<Tag, TagUI>("tg");
const txnTitlesTable = createTable<TxnTitle, TxnTitleUI>("tt");
const txnsTable = createTable<Txn, TxnUI>(
  "t",
  {
    tags: tagsTable,
    title: txnTitlesTable,
    payments: paymentsTable,
  },
  { date: "Date", created: "Date", modified: "Date" }
);

export const db = {
  accounts: {
    expenseAccounts: expenseAccountsTable,
    peopleOrShopAccounts: peopleOrShopAccountsTable,
    capitalAccounts: capitalAccountsTable,
  },
  paymentMethods: paymentMethodsTable,
  payments: paymentsTable,
  tags: tagsTable,
  txnTitles: txnTitlesTable,
  txns: txnsTable,
};
