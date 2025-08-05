import { Structured } from "../../_kvdb";
import { CurrencyType } from "./currency";

/**
 *
 *
 * Models
 */

export type PaymentMethod = Structured<{
  isPermanent: boolean;
  uniqueId?: string;
  name: string;
  type: CurrencyType;
}>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const NET_BANKING_PAYMENT_METHOD: PaymentMethod = {
  id: 0,
  isPermanent: true,
  name: "Net Banking",
  type: "digital",
};

export const CASH_PAYMENT_METHOD: PaymentMethod = {
  id: 0,
  isPermanent: true,
  name: "Notes & Coins",
  type: "physical",
};
