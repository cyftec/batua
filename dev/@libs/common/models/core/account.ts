import { ID, NumBoolean } from "./common";
import { PaymentMethodUI } from "./payment-method";

export type MoneyType = "physical" | "digital" | "mixed";
export type AccountType = "deposit" | "loan" | "friend" | "market";
export type BalanceFigure = "Exact" | "Approx";

export type Account = {
  isPermanent: NumBoolean;
  name: string;
  balance: number;
  vaultType: MoneyType;
  figure: BalanceFigure;
  type: AccountType;
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
