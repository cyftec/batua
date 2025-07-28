import { IDKey } from "../../../kvdb";
import { NumBoolean, Prettify, WithID } from "./common";
import { CurrencyType } from "./currency";
import { PaymentMethodUI } from "./payment-method";

export type ExpenseAccountType = "expense";
export type LoanAccountType = "loan";
export type DepositAccountType = "deposit";
export type CapitalAccountType = LoanAccountType | DepositAccountType;
export type PeopleAccountType = "people";
export type ShopAccountType = "shop";
export type PeopleOrShopAccountType = PeopleAccountType | ShopAccountType;
export type AccountType = Prettify<
  ExpenseAccountType | CapitalAccountType | PeopleOrShopAccountType
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
export type CapitalAccount = Prettify<
  BaseAccount & {
    isPermanent: 0;
    type: CapitalAccountType;
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;
export type LoanAccount = Prettify<
  Omit<CapitalAccount, "type"> & {
    type: LoanAccountType;
  }
>;
export type DepositAccount = Prettify<
  Omit<CapitalAccount, "type"> & {
    type: DepositAccountType;
  }
>;
export type PeopleOrShopAccount = Prettify<
  BaseAccount & {
    type: PeopleOrShopAccountType;
    vault?: undefined;
    paymentMethods?: undefined;
  }
>;
export type PeopleAccount = Prettify<
  Omit<PeopleOrShopAccount, "type"> & {
    isPermanent: 0;
    type: PeopleAccountType;
  }
>;
export type ShopAccount = Prettify<
  Omit<PeopleOrShopAccount, "type"> & {
    type: ShopAccountType;
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
export type CapitalAccountUI = Prettify<WithID<CapitalAccount>>;
export type LoanAccountUI = Prettify<WithID<LoanAccount>>;
export type DepositAccountUI = Prettify<WithID<DepositAccount>>;
export type PeopleOrShopAccountUI = Prettify<WithID<PeopleOrShopAccount>>;
export type PeopleAccountUI = Prettify<WithID<PeopleAccount>>;
export type ShopAccountUI = Prettify<WithID<ShopAccount>>;
export type AccountUI =
  | ExpenseAccountUI
  | CapitalAccountUI
  | LoanAccountUI
  | DepositAccountUI
  | PeopleOrShopAccountUI
  | PeopleAccountUI
  | ShopAccountUI;

/**
 *
 *
 * COMMON CONSTANTS
 */

export const CAPITAL_ACCOUNT_TYPES: Record<
  CapitalAccountType,
  CapitalAccountType
> = {
  loan: "loan",
  deposit: "deposit",
};
export const CAPITAL_ACCOUNT_TYPES_LIST: CapitalAccountType[] = Object.values(
  CAPITAL_ACCOUNT_TYPES
);

export const PERSON_OR_SHOP_ACCOUNT_TYPES: Record<
  PeopleOrShopAccountType,
  PeopleOrShopAccountType
> = {
  people: "people",
  shop: "shop",
};
export const PERSON_OR_SHOP_ACCOUNT_TYPES_LIST: PeopleOrShopAccountType[] =
  Object.values(PERSON_OR_SHOP_ACCOUNT_TYPES);

export const ACCOUNT_TYPES_LIST: AccountType[] = [
  "expense",
  "loan",
  "deposit",
  "people",
  "shop",
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
