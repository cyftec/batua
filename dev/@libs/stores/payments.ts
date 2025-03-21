import { derived, dpromise } from "@cyftech/signal";
import type { ID, PaymentDB, PaymentUI } from "../../@libs/common";
import { db } from "../storage/localdb/setup";
import { allAccounts, fetchAllAccounts } from "./accounts";
import {
  allPaymentServices,
  fetchAllPaymentServices,
  getPaymentMethodUI,
} from "./payment-services";
import { phase } from "@mufw/maya/utils";

const [fetchAllPayments, paymentsList] = dpromise(async () => {
  if (!allAccounts.value.length) await fetchAllAccounts();
  if (!allPaymentServices.value.length) await fetchAllPaymentServices();
  const payments: PaymentUI[] = (await db.payments.getAll()).map((pmt) => ({
    id: pmt.id,
    amount: pmt.amount,
    paymentMethod: getPaymentMethodUI(
      pmt.paymentService as ID,
      pmt.account as ID
    ),
  }));
  return payments;
});

const allPayments = derived(() => paymentsList.value || []);

const getDefaultNewPayment = (): PaymentUI => {
  const firstPS = allPaymentServices.value[0];
  if (!firstPS) throw ``;

  return {
    id: crypto.randomUUID(),
    amount: 0,
    paymentMethod: getPaymentMethodUI(firstPS.id, firstPS.accounts[0].id),
  };
};

const getDefaultNewPayments = (): PaymentUI[] => {
  const firstPS = allPaymentServices.value[0];
  if (!firstPS) return [];

  return [
    {
      id: crypto.randomUUID(),
      amount: 0,
      paymentMethod: getPaymentMethodUI(firstPS.id, firstPS.accounts[0].id),
    },
  ];
};

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
  getDefaultNewPayment,
  getDefaultNewPayments,
  updatePayment,
};
