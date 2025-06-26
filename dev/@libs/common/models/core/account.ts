import { ID, NumBoolean } from "./common";
import { PaymentMethodUI } from "./payment-method";

export const MONEY_TYPES = [
  "digital",
  "physical",
  "unknown",
] as const satisfies string[];
export type MoneyType = (typeof MONEY_TYPES)[number];

export const ACCOUNT_TYPES = [
  "savings",
  "loan",
  "friend",
  "market",
] as const satisfies string[];
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export type BalanceFigure = "Exact" | "Approx";

export type Account = {
  isPermanent: NumBoolean;
  type: AccountType;
  name: string;
  balance: number;
  vaultType: MoneyType;
  figure: BalanceFigure;
  methods: PaymentMethodUI["id"][];
};

/**
 *
 *
 * UI Models
 */

export type AccountUI = Omit<Account, "methods"> & {
  id: ID;
  methods: PaymentMethodUI[];
};
