import { ID, NumBoolean } from "./common";

export type PaymentMethod = {
  isPermanent: NumBoolean;
  uniqueId?: string;
  name: string;
};

/**
 *
 *
 * UI Models
 */

export type PaymentMethodUI = PaymentMethod & { id: ID };
