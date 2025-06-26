import { getTypeData, ID, Payment, PaymentUI } from "../../../models/core";
import { getStore, parseObjectJsonString } from "../../core";
import { accountsStore } from "./accounts";
import { PREFIX } from "./common";
import { paymentMethodsStore } from "./payment-methods";

const lsValueToPayment = (lsValueString: string | null): Payment | undefined =>
  parseObjectJsonString<Payment>(lsValueString, "amount");
const paymentToLsValue = (payment: Payment): string => JSON.stringify(payment);
const paymentToPaymentUI = (id: ID, payment: Payment): PaymentUI => {
  const account = accountsStore.get(payment.account);
  if (!account) throw `Account not found for account-id - '${payment.account}'`;
  const paymentMethod = payment.via
    ? paymentMethodsStore.get(payment.via)
    : undefined;
  if (payment.via && !paymentMethod)
    throw `Payment Method not found for id - '${payment.via}'`;
  const paymentUI: PaymentUI = {
    ...payment,
    id,
    account,
    via: paymentMethod,
  };
  return paymentUI;
};
const paymentUiToPayment = (paymentUI: PaymentUI): Payment => {
  const paymentRecord: Payment = {
    ...paymentUI,
    account: paymentUI.account.id,
    via: paymentUI.via?.id,
  };
  delete paymentRecord["id"];
  return paymentRecord;
};

export const paymentsStore = getStore<Payment, PaymentUI>(
  PREFIX.PAYMENT,
  lsValueToPayment,
  paymentToLsValue,
  paymentToPaymentUI,
  paymentUiToPayment
);
