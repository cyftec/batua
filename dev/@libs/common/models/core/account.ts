import { ID, NumBoolean, TypeData } from "./common";
import { UserUI } from "./user";

export const ACCOUNT_TYPE = {
  investment: "Investment Account (Stocks, Bonds, etc)",
  loan: "Loan Account (Loan or Credit)",
  savings: "Savings Account (Profits, Income, Piggybank or Savings)",
  other: "Account of uncertain type",
} as const;

export type AccountType = keyof typeof ACCOUNT_TYPE;

export type AccountBalance = {
  amount: number;
  type: "Exact" | "Approx";
};

export type Account = {
  isDeletable: NumBoolean;
  name: string;
  balance: AccountBalance;
  type: AccountType;
  owner: UserUI["id"];
};

/**
 *
 *
 * UI Models
 */
export type AccountTypeUI<K extends AccountType> = TypeData<
  typeof ACCOUNT_TYPE,
  K
>;

export type AccountUI = Omit<Account, "type" | "owner"> & {
  id: ID;
  type: AccountTypeUI<AccountType>;
  owner: UserUI;
};

/**
 *
 *
 * Type Transforms
 */
export const getAccountTypeUI = <AT extends AccountType>(
  accountType: AT
): AccountTypeUI<AT> => {
  return {
    key: accountType,
    label: ACCOUNT_TYPE[accountType],
  };
};
