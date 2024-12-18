import {
  ACCOUNT_TYPE,
  CURRENCIES,
  DB_INIT_PHASES,
  PAYMENT_TYPES,
  TRANSACTION_TYPE,
} from "../constants";

export type DbInitializationPhase = keyof typeof DB_INIT_PHASES;
export type Currency = (typeof CURRENCIES)[number];
export type CurrencyCode = Currency["code"];

export type ID = `${string}-${string}-${string}-${string}-${string}`;

export type AccountType = keyof typeof ACCOUNT_TYPE;
export type Account = {
  id: ID;
  type: AccountType;
  name: string;
  uniqueId: string | undefined;
  balance: number;
  currency: CurrencyCode;
};

export type PaymentMethod = {
  id: ID;
  name: string;
  uniqueId: string | undefined;
  expiry: Date | undefined;
};

export type TagCategory = {
  id: ID;
  icon: string;
  name: string;
};

export type Tag = {
  id: ID;
  name: string;
  category: TagCategory["name"];
  isEditable: 0 | 1;
};

export type Budget = {
  id: ID;
  name: string;
  limit: number;
  spend: number;
  startDate: Date;
  endDate: Date;
  currency: CurrencyCode;
  tags: Tag["name"][];
};

export type TransactionType = keyof typeof TRANSACTION_TYPE;

type TransactionWoPayments = {
  id: ID;
  title: string;
  date: Date;
  createdAt: Date;
  modifiedAt: Date;
  type: TransactionType;
  tags: Tag["name"][];
};

export type Transaction = TransactionWoPayments & {
  payments: Payment["id"][];
};

export type TransactionUI = TransactionWoPayments & {
  payments: Payment[];
};

export type PaymentType = keyof typeof PAYMENT_TYPES;

export type Payment = {
  id: ID;
  transactionId: Transaction["id"];
  amount: number;
  currencyCode: CurrencyCode;
  account: Account["id"];
  paymentMethod: PaymentMethod["id"];
  type: PaymentType;
};
