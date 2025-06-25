import {
  getTypeData,
  ID,
  Payment,
  PAYMENT_TYPES,
  PaymentUI,
} from "../../../models/core";
import { getStore, parseObjectJsonString } from "../../core";
import { PREFIX } from "./common";
import { paymentModesStore } from "./payment-modes";

const getPaymentFromLsValue = (
  lsValueString: string | null
): Payment | undefined =>
  parseObjectJsonString<Payment>(lsValueString, "amount");
const paymentToLsValue = (payment: Payment): string => JSON.stringify(payment);
const paymentToPaymentUI = (id: ID, payment: Payment): PaymentUI => {
  const paymentMode = paymentModesStore.get(payment.mode);
  if (!paymentMode) throw `Payment mode not found for id - '${payment.mode}'`;
  const paymentUI: PaymentUI = {
    ...payment,
    id,
    type: getTypeData(PAYMENT_TYPES, payment.type),
    mode: paymentMode,
  };
  return paymentUI;
};
const paymentUiToPayment = (paymentUI: PaymentUI): Payment => {
  const paymentRecord: Payment = {
    ...paymentUI,
    type: paymentUI.type.key,
    mode: paymentUI.mode.id,
  };
  delete paymentRecord["id"];
  return paymentRecord;
};

export const paymentsStore = getStore<Payment, PaymentUI>(
  PREFIX.PAYMENT,
  getPaymentFromLsValue,
  paymentToLsValue,
  paymentToPaymentUI,
  paymentUiToPayment
);
