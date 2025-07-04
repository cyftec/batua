import { ID, IDKey } from "../../localstorage/core";
import { ExpenseAccountUI } from "./account";
import { Prettify } from "./common";
import { PaymentMethodUI } from "./payment-method";

export type Payment = {
  amount: number;
  account: ExpenseAccountUI[IDKey];
  via?: PaymentMethodUI[IDKey];
};

/**
 *
 *
 * UI Models
 */

export type PaymentUI = Prettify<
  Omit<Payment, "account" | "via"> & {
    id: ID;
    account: ExpenseAccountUI;
    via?: PaymentMethodUI;
  }
>;
