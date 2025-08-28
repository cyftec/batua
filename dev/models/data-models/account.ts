import { Prettify, Structured } from "@cyftec/kvdb";
import { CurrencyType } from "./currency";
import { PaymentMethod } from "./payment-method";

/**
 *
 *
 * COMMON CONSTANTS
 */

export const EXPENSE_ACCOUNT_TYPE = "expense";
export const LOAN_ACCOUNT_TYPE = "loan";
export const DEPOSIT_ACCOUNT_TYPE = "deposit";
export const SHOP_ACCOUNT_TYPE = "shop";
export const PEOPLE_ACCOUNT_TYPE = "people";

export const ACCOUNT_TYPES_LIST = [
  EXPENSE_ACCOUNT_TYPE,
  LOAN_ACCOUNT_TYPE,
  DEPOSIT_ACCOUNT_TYPE,
  SHOP_ACCOUNT_TYPE,
  PEOPLE_ACCOUNT_TYPE,
] as const satisfies string[];

/**
 *
 *
 * MODELS
 */

export type AccountType = (typeof ACCOUNT_TYPES_LIST)[number];

export type Account = Structured<{
  isPermanent: boolean;
  type: AccountType;
  name: string;
  uniqueId?: string;
  vault?: CurrencyType;
  paymentMethods?: PaymentMethod[];
}>;

export type ExpenseAccount = Prettify<
  Omit<Account, "type" | "vault" | "paymentMethods"> & {
    type: "expense";
    vault: CurrencyType;
    paymentMethods: PaymentMethod[];
  }
>;
export type LoanAccount = Prettify<
  Omit<Account, "type" | "vault" | "paymentMethods"> & {
    type: "loan";
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;
export type DepositAccount = Prettify<
  Omit<Account, "type" | "vault" | "paymentMethods"> & {
    type: "deposit";
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;
export type ShopAccount = Prettify<
  Omit<Account, "type" | "vault" | "paymentMethods"> & {
    type: "shop";
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;
export type PeopleAccount = Prettify<
  Omit<Account, "type" | "vault" | "paymentMethods"> & {
    type: "people";
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const CASH_EXPENSE_ACCOUNT: ExpenseAccount = {
  id: 0,
  isPermanent: false,
  name: "Wallet",
  vault: "physical",
  type: "expense",
  paymentMethods: [],
};

export const MARKET: ShopAccount = {
  id: 0,
  isPermanent: true,
  name: "Market",
  type: "shop",
};
