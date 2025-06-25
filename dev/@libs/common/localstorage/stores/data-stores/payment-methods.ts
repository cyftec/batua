import { ID, PaymentMethod, PaymentMethodUI } from "../../../models/core";
import { getStore, parseObjectJsonString } from "../../core";
import { PREFIX } from "./common";

const getPaymentMethodFromLsValue = (
  lsValueString: string | null
): PaymentMethod | undefined =>
  parseObjectJsonString<PaymentMethod>(lsValueString, "name");
const paymentMethodToLsValue = (paymentMethod: PaymentMethod): string =>
  JSON.stringify(paymentMethod);
const paymentMethodToPaymentMethodUI = (
  id: ID,
  paymentMethod: PaymentMethod
): PaymentMethodUI => {
  const paymentMethodUI: PaymentMethodUI = { ...paymentMethod, id };
  return paymentMethodUI;
};
const paymentMethodUiToPaymentMethod = (
  paymentMethodUI: PaymentMethodUI
): PaymentMethod => {
  const paymentMethodRecord: PaymentMethod = { ...paymentMethodUI };
  delete paymentMethodRecord["id"];
  return paymentMethodRecord;
};

export const paymentMethodsStore = getStore<PaymentMethod, PaymentMethodUI>(
  PREFIX.PAYMENT_METHOD,
  getPaymentMethodFromLsValue,
  paymentMethodToLsValue,
  paymentMethodToPaymentMethodUI,
  paymentMethodUiToPaymentMethod
);
