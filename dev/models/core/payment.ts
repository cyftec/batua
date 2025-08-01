import { WithID } from "../../_kvdb";
import { Account } from "./account";
import { Prettify } from "./common";
import { PaymentMethod } from "./payment-method";

export type PaymentRaw = {
  amount: number;
  account: Account;
  via?: PaymentMethod;
};

/**
 *
 *
 * UI Models
 */

export type Payment = Prettify<WithID<PaymentRaw>>;
