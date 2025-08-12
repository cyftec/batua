import { Structured } from "../../_kvdb";
import { Account } from "./account";
import { PaymentMethod } from "./payment-method";

/**
 *
 *
 * UI Models
 */

export type Payment = Structured<{
  amount: number;
  account: Account;
  via?: PaymentMethod;
}>;
