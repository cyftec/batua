import { NumBoolean, Prettify, WithID } from "./common";
import { CurrencyType } from "./currency";

export type PaymentMethod = {
  isPermanent: NumBoolean;
  uniqueId?: string;
  name: string;
  type: CurrencyType;
  slave: boolean;
};

/**
 *
 *
 * UI Models
 */

export type PaymentMethodUI = Prettify<WithID<PaymentMethod>>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const NET_BANKING_PAYMENT_METHOD: PaymentMethod = {
  isPermanent: 1,
  name: "Net Banking",
  type: "digital",
  slave: false,
};

export const CASH_PAYMENT_METHOD: PaymentMethod = {
  isPermanent: 1,
  name: "Notes & Coins",
  type: "physical",
  slave: false,
};
