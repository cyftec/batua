import { AccountUI } from "./account";
import { CombinedTypeSeparator, NumBoolean, ID, TypeData } from "./common";

export const PAYMENT_TYPES = {
  debit: "Debited from",
  credit: "Credited to",
} as const;

export type PaymentType = keyof typeof PAYMENT_TYPES;

export type PaymentMethod = {
  isDeletable: NumBoolean;
  uniqueId?: string | number;
  name: string;
};

export type PaymentMode =
  `${AccountUI["id"]}${CombinedTypeSeparator}${PaymentMethodUI["id"]}`;

export type Payment = {
  amount: number;
  type: PaymentType;
  mode: PaymentModeUI["id"];
};

/**
 *
 *
 * UI Models
 */
export type PaymentTypeUI<K extends PaymentType> = TypeData<
  typeof PAYMENT_TYPES,
  K
>;

export type PaymentMethodUI = PaymentMethod & {
  id: ID;
};

export type PaymentModeUI = {
  id: ID;
  account: AccountUI;
  paymentMethod: PaymentMethodUI;
};

export type PaymentUI = Omit<Payment, "type" | "mode"> & {
  id: ID;
  type: PaymentTypeUI<PaymentType>;
  mode: PaymentModeUI;
};
