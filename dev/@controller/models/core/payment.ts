import { IDKey, TableRecordID } from "../../kvdb";
import { AccountUI } from "./account";
import { Prettify } from "./common";
import { PaymentMethodUI } from "./payment-method";

export type Payment = {
  amount: number;
  account: AccountUI[IDKey];
  via?: PaymentMethodUI[IDKey];
};

/**
 *
 *
 * UI Models
 */

export type PaymentUI = Prettify<
  Omit<Payment, "account" | "via"> & {
    id: TableRecordID;
    account: AccountUI;
    via?: PaymentMethodUI;
  }
>;
