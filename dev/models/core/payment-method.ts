import { NumBoolean, Prettify, WithID } from "./common";
import { CurrencyType } from "./currency";

export type PaymentMethodRaw = {
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

export type PaymentMethod = Prettify<WithID<PaymentMethodRaw>>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const NET_BANKING_PAYMENT_METHOD: PaymentMethodRaw = {
  isPermanent: 1,
  name: "Net Banking",
  type: "digital",
  slave: false,
};

export const CASH_PAYMENT_METHOD: PaymentMethodRaw = {
  isPermanent: 1,
  name: "Notes & Coins",
  type: "physical",
  slave: false,
};
