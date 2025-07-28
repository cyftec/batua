import { IDKey } from "../../../@kvdb";
import { NumBoolean, Prettify, WithID } from "./common";
import { CurrencyType } from "./currency";
import { PaymentMethodUI } from "./payment-method";

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

export type BaseAccount = {
  isPermanent: NumBoolean;
  name: string;
  balance: number;
  uniqueId?: string;
  vault?: CurrencyType;
  paymentMethods?: PaymentMethodUI[IDKey][];
};
export type ExpenseAccount = Prettify<
  BaseAccount & {
    isPermanent: 0;
    type: ExpenseAccountType;
    vault: CurrencyType;
    paymentMethods: PaymentMethodUI[IDKey][];
  }
>;
export type FundAccount = Prettify<
  BaseAccount & {
    isPermanent: 0;
    type: FundAccountType;
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;
export type LoanAccount = Prettify<
  Omit<FundAccount, "type"> & {
    type: LoanAccountType;
  }
>;
export type DepositAccount = Prettify<
  Omit<FundAccount, "type"> & {
    type: DepositAccountType;
  }
>;
export type EntityAccount = Prettify<
  BaseAccount & {
    type: EntityAccountType;
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;
export type ShopAccount = Prettify<
  Omit<EntityAccount, "type"> & {
    type: ShopAccountType;
  }
>;
export type PeopleAccount = Prettify<
  Omit<EntityAccount, "type"> & {
    isPermanent: 0;
    type: PeopleAccountType;
  }
>;
export type Account = Prettify<
  BaseAccount & {
    type: AccountType;
    vault?: CurrencyType;
    paymentMethods?: PaymentMethodUI[IDKey][];
  }
>;

/**
 *
 *
 * UI Models
 */

export type ExpenseAccountUI = Prettify<
  WithID<
    Omit<ExpenseAccount, "paymentMethods"> & {
      paymentMethods: PaymentMethodUI[];
    }
  >
>;
export type LoanAccountUI = Prettify<WithID<LoanAccount>>;
export type DepositAccountUI = Prettify<WithID<DepositAccount>>;
export type ShopAccountUI = Prettify<WithID<ShopAccount>>;
export type PeopleAccountUI = Prettify<WithID<PeopleAccount>>;
export type AccountUI =
  | ExpenseAccountUI
  | LoanAccountUI
  | DepositAccountUI
  | ShopAccountUI
  | PeopleAccountUI;

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

export const CASH_EXPENSE_ACCOUNT: ExpenseAccount = {
  isPermanent: 0,
  name: "Wallet",
  balance: 0,
  vault: "physical",
  type: "expense",
  paymentMethods: [],
};

export const MARKET: ShopAccount = {
  isPermanent: 1,
  name: "Market",
  balance: Number.MAX_SAFE_INTEGER,
  type: "shop",
};
