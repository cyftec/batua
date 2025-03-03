import {
  ACCOUNT_TYPE,
  CURRENCIES,
  DB_INIT_PHASES,
  PAYMENT_TYPES,
  TRANSACTION_TYPE,
} from "../constants";

export type DbInitializationPhase = keyof typeof DB_INIT_PHASES;
export type AccountType = keyof typeof ACCOUNT_TYPE;
export type TransactionType = keyof typeof TRANSACTION_TYPE;
export type PaymentType = keyof typeof PAYMENT_TYPES;
export type Currency = (typeof CURRENCIES)[number];
export type CurrencyCode = Currency["code"];
export type ID = `${string}-${string}-${string}-${string}-${string}`;

export type Account = {
  name: string;
  type: AccountType;
  uniqueId: string | undefined;
  balance: number;
  currency: CurrencyCode;
};

export type PaymentMethod = {
  name: string;
  uniqueId: string | undefined;
  expiry: Date | undefined;
};

export type TagCategory = {
  icon: string;
  name: string;
  isCategoryEditable: 0 | 1;
  isTagEditable: 0 | 1;
};

export type Tag = {
  name: string;
  category: TagCategory["name"];
};

export type Payment = {
  id: ID;
  amount: number;
  currencyCode: CurrencyCode;
  account: Account["name"];
  paymentMethod: PaymentMethod["name"];
  type: PaymentType;
};

export type Transaction = {
  id: ID;
  title: string;
  date: Date;
  createdAt: Date;
  modifiedAt: Date;
  type: TransactionType;
  tags: Tag["name"][];
  payments: Payment["id"][];
};

export type Budget = {
  name: string;
  limit: number;
  spend: number;
  startDate: Date;
  endDate: Date;
  currency: CurrencyCode;
  tags: Tag["name"][];
};

/**
 * UI Models
 */
export type TransactionUI = Omit<Transaction, "payments"> & {
  payments: Payment[];
};
export type TagsCategory = TagCategory & { tags: Tag[] };
