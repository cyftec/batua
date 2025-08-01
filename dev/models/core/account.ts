import { WithID } from "../../_kvdb";
import { NumBoolean, Prettify } from "./common";
import { CurrencyType } from "./currency";
import { PaymentMethod } from "./payment-method";

export type ExpenseAccountType = "expense";
export type LoanAccountType = "loan";
export type DepositAccountType = "deposit";
export type ShopAccountType = "shop";
export type PeopleAccountType = "people";
export type FundAccountType = LoanAccountType | DepositAccountType;
export type EntityAccountType = ShopAccountType | PeopleAccountType;
export type AccountType = Prettify<
  ExpenseAccountType | FundAccountType | EntityAccountType
>;

export type BaseAccountRaw = {
  isPermanent: NumBoolean;
  name: string;
  uniqueId?: string;
  vault?: CurrencyType;
  paymentMethods?: PaymentMethod[];
};
export type ExpenseAccountRaw = Prettify<
  BaseAccountRaw & {
    type: ExpenseAccountType;
    vault: CurrencyType;
    paymentMethods: PaymentMethod[];
  }
>;
export type FundAccountRaw = Prettify<
  BaseAccountRaw & {
    vault?: undefined;
    paymentMethods?: undefined;
    type: FundAccountType;
  }
>;
export type LoanAccountRaw = Prettify<
  Omit<FundAccountRaw, "type"> & {
    type: LoanAccountType;
  }
>;
export type DepositAccountRaw = Prettify<
  Omit<FundAccountRaw, "type"> & {
    type: DepositAccountType;
  }
>;
export type EntityAccountRaw = Prettify<
  BaseAccountRaw & {
    vault?: undefined;
    paymentMethods?: undefined;
    type: EntityAccountType;
  }
>;
export type ShopAccountRaw = Prettify<
  Omit<EntityAccountRaw, "type"> & {
    type: ShopAccountType;
  }
>;
export type PeopleAccountRaw = Prettify<
  Omit<EntityAccountRaw, "type"> & {
    type: PeopleAccountType;
  }
>;
export type AccountRaw = Prettify<
  BaseAccountRaw & {
    vault?: CurrencyType;
    paymentMethods?: PaymentMethod[];
    type: AccountType;
  }
>;

/**
 *
 *
 * UI Models
 */

export type ExpenseAccount = Prettify<WithID<ExpenseAccountRaw>>;
export type LoanAccount = Prettify<WithID<LoanAccountRaw>>;
export type DepositAccount = Prettify<WithID<DepositAccountRaw>>;
export type ShopAccount = Prettify<WithID<ShopAccountRaw>>;
export type PeopleAccount = Prettify<WithID<PeopleAccountRaw>>;
export type Account =
  | ExpenseAccount
  | LoanAccount
  | DepositAccount
  | ShopAccount
  | PeopleAccount;

/**
 *
 *
 * COMMON CONSTANTS
 */

export const EXPENSE_ACCOUNT_TYPE: ExpenseAccountType = "expense";
export const LOAN_ACCOUNT_TYPE: LoanAccountType = "loan";
export const DEPOSIT_ACCOUNT_TYPE: DepositAccountType = "deposit";
export const SHOP_ACCOUNT_TYPE: ShopAccountType = "shop";
export const PEOPLE_ACCOUNT_TYPE: PeopleAccountType = "people";

export const ACCOUNT_TYPES_LIST: AccountType[] = [
  "expense",
  "loan",
  "deposit",
  "shop",
  "people",
];

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const CASH_EXPENSE_ACCOUNT: ExpenseAccountRaw = {
  isPermanent: 0,
  name: "Wallet",
  vault: "physical",
  type: "expense",
  paymentMethods: [],
};

export const MARKET: ShopAccountRaw = {
  isPermanent: 1,
  name: "Market",
  type: "shop",
};
