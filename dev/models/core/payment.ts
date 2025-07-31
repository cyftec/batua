import { IDKey, DbRecordID } from "../../_kvdb";
import { Account } from "./account";
import { Prettify } from "./common";
import { PaymentMethod } from "./payment-method";

export type PaymentRaw = {
  amount: number;
  account: Account[IDKey];
  via?: PaymentMethod[IDKey];
};

/**
 *
 *
 * UI Models
 */

export type Payment = Prettify<
  Omit<PaymentRaw, "account" | "via"> & {
    id: DbRecordID;
    account: Account;
    via?: PaymentMethod;
  }
>;
