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
export type ID = ReturnType<Crypto["randomUUID"]>;

export type AccountDB = {
  id: ID;
  name: string;
  type: AccountType;
  uniqueId: string | undefined;
  balance: number;
  currency: CurrencyCode;
};

export type PaymentServiceDB = {
  id: ID;
  name: string;
  uniqueId: string | undefined;
  accounts: AccountDB["id"][];
};

export type TagCategory = {
  id: ID;
  icon: string;
  name: string;
  isCategoryEditable: 0 | 1;
  isTagEditable: 0 | 1;
};

export type TagDB = {
  id: ID;
  name: string;
  category: TagCategory["id"];
};

export type PaymentDB = {
  id: ID;
  amount: number;
  account: AccountDB["id"];
  paymentService: PaymentServiceDB["id"];
};

export type TransactionDB = {
  id: ID;
  title: string;
  date: Date;
  createdAt: Date;
  modifiedAt: Date;
  type: TransactionType;
  tags: TagDB["id"][];
  payments: PaymentDB["id"][];
};

export type BudgetDB = {
  id: ID;
  name: string;
  limit: number;
  spend: number;
  startDate: Date;
  endDate: Date;
  currency: CurrencyCode;
  tags: TagDB["id"][];
};

/**
 * UI Models
 */
export type AccountUI = Omit<AccountDB, "currency"> & {
  currency: Currency;
};
export type TagUI = Omit<TagDB, "category"> & {
  category: TagCategory;
};
export type TagCategoryUI = {
  id: ID;
  icon: string;
  name: string;
  isCategoryEditable: 0 | 1;
  isTagEditable: 0 | 1;
  tags: TagUI[];
};
export type PaymentServiceUI = Omit<PaymentServiceDB, "accounts"> & {
  accounts: AccountUI[];
};
export type PaymentMethodUI = Omit<PaymentServiceDB, "accounts"> & {
  account: AccountUI;
};
export type PaymentUI = Omit<PaymentDB, "account" | "paymentService"> & {
  paymentMethod: PaymentMethodUI;
};
export type TransactionUI = Omit<TransactionDB, "tags" | "payments"> & {
  tags: TagUI[];
  payments: PaymentUI[];
};
