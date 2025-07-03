import { Account, AccountUI, ExpenseAccountUI } from "./account";
import { ID, Prettify } from "./common";
import { PaymentMethodUI } from "./payment-method";

export type Payment = {
  amount: number;
  account: AccountUI["id"];
  via?: PaymentMethodUI["id"];
};

/**
 *
 *
 * UI Models
 */

export type PaymentUI = Prettify<
  Omit<Payment, "account" | "via"> & {
    id: ID;
    account: AccountUI;
    via?: PaymentMethodUI;
  }
>;
