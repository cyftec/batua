import { derived, dpromise } from "@cyftech/signal";
import type {
  AccountUI,
  PaymentDB,
  PaymentMethod,
  PaymentUI,
} from "../../@libs/common";
import { db } from "../storage/localdb/setup";
import { allPaymentMethods, fetchAllPaymentMethods } from "./payment-methods";
import { allAccounts, fetchAllAccounts } from "./accounts";

const [fetchAllPayments, paymentsList] = dpromise(async () => {
  if (!allAccounts.value.length) await fetchAllAccounts();
  if (!allPaymentMethods.value.length) await fetchAllPaymentMethods();
  const payments: PaymentUI[] = (await db.payments.getAll()).map((pmt) => ({
    ...pmt,
    account: allAccounts.value?.find(
      (acc) => acc.id === pmt.account
    ) as AccountUI,
    paymentMethod: allPaymentMethods.value?.find(
      (pm) => pm.id === pmt.paymentMethod
    ) as PaymentMethod,
  }));
  return payments;
});

const allPayments = derived(() => paymentsList.value || []);

const [addPayment] = dpromise((payment: PaymentDB) => db.payments.add(payment));

const [updatePayment] = dpromise((payment: PaymentDB) =>
  db.payments.put(payment)
);

const [deletePayment] = dpromise((paymentId: PaymentDB["id"]) =>
  db.payments.delete(paymentId)
);

export {
  addPayment,
  allPayments,
  deletePayment,
  fetchAllPayments,
  updatePayment,
};
