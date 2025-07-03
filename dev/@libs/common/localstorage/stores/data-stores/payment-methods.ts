import {
  ExpenseAccountUI,
  ID,
  PaymentMethod,
  PaymentMethodUI,
} from "../../../models/core";
import { createStore, parseObjectJsonString } from "../../core";
import { accountsStore } from "./accounts";

const lsValueToPaymentMethod = (
  lsValueString: string | null
): PaymentMethod | undefined =>
  parseObjectJsonString<PaymentMethod>(lsValueString, "name");

const paymentMethodToLsValue = (paymentMethod: PaymentMethod): string =>
  JSON.stringify(paymentMethod);

export const paymentMethodToPaymentMethodUI = (
  id: ID,
  paymentMethod: PaymentMethod
): PaymentMethodUI => {
  const accounts = accountsStore.getAll(paymentMethod.accounts);
  const expenseAccounts = accounts.filter(
    (acc) => acc.type === "Expense"
  ) as ExpenseAccountUI[];
  const paymentMethodUI: PaymentMethodUI = {
    ...paymentMethod,
    id,
    accounts: expenseAccounts,
  };
  return paymentMethodUI;
};

export const paymentMethodUiToPaymentMethod = (
  paymentMethodUI: PaymentMethodUI
): PaymentMethod => {
  const paymentMethodRecord: PaymentMethod = {
    ...paymentMethodUI,
    accounts: paymentMethodUI.accounts.map((acc) => acc.id),
  };
  delete paymentMethodRecord["id"];
  return paymentMethodRecord;
};

export const paymentMethodsStore = createStore<PaymentMethod, PaymentMethodUI>(
  "pm_",
  lsValueToPaymentMethod,
  paymentMethodToLsValue,
  paymentMethodToPaymentMethodUI,
  paymentMethodUiToPaymentMethod
);
