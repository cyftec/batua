import { NumBoolean, Prettify, WithID } from "./common";
import { CurrencyType } from "./currency";

export type MarketAccountType = "Debt" | "Investment";
export type AccountType = Prettify<
  "World" | "Expense" | "Friend" | MarketAccountType
>;
export type EditableAccountType = Prettify<Exclude<AccountType, "World">>;
export type Account = {
  isPermanent: NumBoolean;
  uniqueId?: string;
  name: string;
  balance: number;
  type: AccountType;
  vault?: CurrencyType;
};

export type WorldAccount = Prettify<
  Account & {
    uniqueId: undefined;
    type: "World";
    vault: undefined;
  }
>;

export type MarketAccount = Prettify<
  Account & {
    type: MarketAccountType;
    vault: undefined;
  }
>;

export type FriendAccount = Prettify<
  Account & {
    type: "Friend";
    vault: undefined;
  }
>;

export type ExpenseAccount = Prettify<
  Account & {
    type: "Expense";
    vault: CurrencyType;
  }
>;

/**
 *
 *
 * UI Models
 */
export type AccountUI = Prettify<WithID<Account>>;

export type WorldAccountUI = Prettify<WithID<WorldAccount>>;

export type MarketAccountUI = Prettify<WithID<MarketAccount>>;

export type FriendAccountUI = Prettify<WithID<FriendAccount>>;

export type ExpenseAccountUI = Prettify<WithID<ExpenseAccount>>;

/**
 *
 *
 * CONSTANTS
 */

export const EDITABLE_ACCOUNT_TYPES: EditableAccountType[] = [
  "Expense",
  "Debt",
  "Investment",
  "Friend",
];
export const MARKET_ACCOUNT_TYPES: MarketAccountType[] = ["Debt", "Investment"];
