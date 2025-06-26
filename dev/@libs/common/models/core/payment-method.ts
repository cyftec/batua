import { ID, NumBoolean } from "./common";

export type PaymentMethod = {
  isPermanent: NumBoolean;
  uniqueId?: string | number;
  name: string;
};

/**
 *
 *
 * UI Models
 */

export type PaymentMethodUI = PaymentMethod & { id: ID };
