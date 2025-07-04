import { IDKey } from "../../localstorage/core";
import { NumBoolean, Prettify, WithID } from "./common";
import { CurrencyType } from "./currency";
import { PaymentMethodUI } from "./payment-method";

export type ExpenseAccountType = "Expense";
export type PeopleAccountType = "People";
export type ShopAccountType = "Shop";
export type PeopleOrShopAccountType = PeopleAccountType | ShopAccountType;
export type LoanAccountType = "Loan";
export type InvestmentAccountType = "Investment";
export type CapitalAccountType = LoanAccountType | InvestmentAccountType;

export type BaseAccount = {
  isPermanent: NumBoolean;
  uniqueId?: string;
  name: string;
  balance: number;
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
  }
>;
export type LoanAccount = Prettify<
  Omit<CapitalAccount, "type"> & {
    type: LoanAccountType;
  }
>;
export type InvestmentAccount = Prettify<
  Omit<CapitalAccount, "type"> & {
    type: InvestmentAccountType;
  }
>;
export type PeopleOrShopAccount = Prettify<
  BaseAccount & {
    type: PeopleOrShopAccountType;
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

/**
 *
 *
 * UI Models
 */

export type BaseAccountUI = Prettify<WithID<BaseAccount>>;
export type ExpenseAccountUI = Prettify<
  WithID<
    Omit<ExpenseAccount, "paymentMethods"> & {
      paymentMethods: PaymentMethodUI[];
    }
  >
>;
export type CapitalAccountUI = Prettify<WithID<CapitalAccount>>;
export type LoanAccountUI = Prettify<WithID<LoanAccount>>;
export type InvestmentAccountUI = Prettify<WithID<InvestmentAccount>>;
export type PeopleOrShopAccountUI = Prettify<WithID<PeopleOrShopAccount>>;
export type PeopleAccountUI = Prettify<WithID<PeopleAccount>>;
export type ShopAccountUI = Prettify<WithID<ShopAccount>>;

/**
 *
 *
 * COMMON CONSTANTS
 */

export const CAPITAL_ACCOUNT_TYPES: Record<
  CapitalAccountType,
  CapitalAccountType
> = {
  Loan: "Loan",
  Investment: "Investment",
};
export const CAPITAL_ACCOUNT_TYPES_LIST: CapitalAccountType[] = Object.values(
  CAPITAL_ACCOUNT_TYPES
);

export const PERSON_OR_SHOP_ACCOUNT_TYPES: Record<
  PeopleOrShopAccountType,
  PeopleOrShopAccountType
> = {
  People: "People",
  Shop: "Shop",
};
export const PERSON_OR_SHOP_ACCOUNT_TYPES_LIST: PeopleOrShopAccountType[] =
  Object.values(PERSON_OR_SHOP_ACCOUNT_TYPES);

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const CASH_EXPENSE_ACCOUNT: ExpenseAccount = {
  isPermanent: 0,
  name: "Cash in wallet",
  balance: 0,
  vault: "physical",
  type: "Expense",
  paymentMethods: [],
};

export const UNKNOWN_SHOP: ShopAccount = {
  isPermanent: 1,
  name: "Unknown Shops",
  balance: Number.MAX_SAFE_INTEGER,
  type: "Shop",
};
