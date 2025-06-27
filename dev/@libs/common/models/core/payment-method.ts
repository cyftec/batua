import { ID, NumBoolean } from "./common";
import { CurrencyType } from "./currency";

export type PaymentMethod = {
  isPermanent: NumBoolean;
  uniqueId?: string;
  name: string;
  mode: CurrencyType;
};

/**
 *
 *
 * UI Models
 */

export type PaymentMethodUI = PaymentMethod & { id: ID };
