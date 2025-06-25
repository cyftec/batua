import {
  COMBINED_TYPE_SEPARATOR,
  ID,
  PaymentMode,
  PaymentModeUI,
} from "../../../models/core";
import { parseNum } from "../../../utils";
import { getStore } from "../../core";
import { accountsStore } from "./accounts";
import { PREFIX } from "./common";
import { paymentMethodsStore } from "./payment-methods";

const getPaymentModeFromLsValue = (
  lsValueString: string | null
): PaymentMode | undefined => {
  if (!lsValueString) return;
  const [keyStr, idStr] = lsValueString.split(COMBINED_TYPE_SEPARATOR);
  const key = parseNum(keyStr) || 0;
  const id = parseNum(idStr) || 0;
  if (!key || !id) return;
  return `${key}##${id}`;
};
const paymentModeToLsValue = (paymentMode: PaymentMode): string => paymentMode;
const paymentModeToPaymentModeUI = (
  id: ID,
  paymentMode: PaymentMode
): PaymentModeUI => {
  const [accStr, pmStr] = paymentMode.split(COMBINED_TYPE_SEPARATOR);
  const accID = parseNum(accStr) || 0;
  const pmID = parseNum(pmStr) || 0;
  if (!accID || !pmID)
    throw `Invalid payment mode. Payment mode - '${paymentMode}' doesn't consist of either valid account-id or valid payment-method-id.`;
  const account = accountsStore.get(accID);
  if (!account) throw `Account not found for id - '${accID}'`;
  const paymentMethod = paymentMethodsStore.get(pmID);
  if (!paymentMethod) throw `Payment method not found for id - '${pmID}'`;

  return { id, account, paymentMethod };
};
const paymentModeUiToPaymentMode = (
  paymentModeUI: PaymentModeUI
): PaymentMode =>
  `${paymentModeUI.account.id}${COMBINED_TYPE_SEPARATOR}${paymentModeUI.paymentMethod.id}`;

export const paymentModesStore = getStore<PaymentMode, PaymentModeUI>(
  PREFIX.PAYMENT_MODE,
  getPaymentModeFromLsValue,
  paymentModeToLsValue,
  paymentModeToPaymentModeUI,
  paymentModeUiToPaymentMode
);
