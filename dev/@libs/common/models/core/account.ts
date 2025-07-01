import { ID, NumBoolean } from "./common";
import { CurrencyType } from "./currency";
import { PaymentMethodUI } from "./payment-method";

export const SELF_ACCOUNT_TYPES = ["asset", "debt"] as const satisfies string[];
export type SelfAccountType = (typeof SELF_ACCOUNT_TYPES)[number];
export const ACCOUNT_TYPES = [
  ...SELF_ACCOUNT_TYPES,
  "friend",
  "market",
] as const satisfies string[];
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export type Account = {
  isPermanent: NumBoolean;
  name: string;
  uniqueId?: string;
  balance: number;
  type: AccountType;
  vault?: CurrencyType;
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
