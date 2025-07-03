import { ExpenseAccountUI } from "./account";
import { ID, NumBoolean, Prettify } from "./common";
import { CurrencyType } from "./currency";

export type PaymentMethod = {
  isPermanent: NumBoolean;
  uniqueId?: string;
  name: string;
  type: CurrencyType;
  slave: boolean;
  accounts: ExpenseAccountUI["id"][];
};

/**
 *
 *
 * UI Models
 */

export type PaymentMethodUI = Prettify<
  Omit<PaymentMethod, "accounts"> & {
    id: ID;
    accounts: ExpenseAccountUI[];
  }
>;
