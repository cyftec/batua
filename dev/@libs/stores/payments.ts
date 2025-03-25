import { derived, dpromise } from "@cyftech/signal";
import type { ID, PaymentDB, PaymentUI } from "../../@libs/common";
import { db } from "../storage/localdb/setup";
import { addBalanceToAccount, allAccounts, fetchAllAccounts } from "./accounts";
import {
  allPaymentServices,
  fetchAllPaymentServices,
  getPaymentMethodUI,
} from "./payment-services";

const getPaymentUiFromDb = (paymentDb: PaymentDB): PaymentUI => {
  return {
    id: paymentDb.id,
    amount: paymentDb.amount,
    paymentMethod: getPaymentMethodUI(
      paymentDb.paymentService,
      paymentDb.account
    ),
  };
};

const [fetchAllPayments, paymentsList] = dpromise(async () => {
  if (!allAccounts.value.length) await fetchAllAccounts();
  if (!allPaymentServices.value.length) await fetchAllPaymentServices();
  const payments = await db.payments.getAll();
  return payments.map((pmt) => getPaymentUiFromDb(pmt));
});
const allPayments = derived(() => paymentsList.value || []);

const findPayment = async (paymentID: ID): Promise<PaymentUI | undefined> => {
  if (!paymentID) throw `Invalid payment-ID for finding the payment`;
  const paymentDb = await db.payments.get(paymentID);
  if (!paymentDb) return;
  return getPaymentUiFromDb(paymentDb);
};

const addPayment = async (payment: PaymentUI) => {
  await addBalanceToAccount(payment.paymentMethod.account.id, payment.amount);
  const p: PaymentDB = {
    ...payment,
    paymentService: payment.paymentMethod.id,
    account: payment.paymentMethod.account.id,
  };
  await db.payments.add(p);
  await fetchAllPayments();
};

const updatePayment = async (newPayment: PaymentUI) => {
  const earlierPayment = await findPayment(newPayment.id);
  if (!earlierPayment) throw `This doesn't look like a payment to be updated`;

  if (
    earlierPayment.paymentMethod.account.id ===
    newPayment.paymentMethod.account.id
  ) {
    if (earlierPayment.amount !== newPayment.amount) {
      await addBalanceToAccount(
        newPayment.paymentMethod.account.id,
        newPayment.amount - earlierPayment.amount
      );
    }
  } else {
    await addBalanceToAccount(
      earlierPayment.paymentMethod.account.id,
      -earlierPayment.amount
    );
    await addBalanceToAccount(
      newPayment.paymentMethod.account.id,
      newPayment.amount
    );
  }

  const p: PaymentDB = {
    ...newPayment,
    paymentService: newPayment.paymentMethod.id,
    account: newPayment.paymentMethod.account.id,
  };
  await db.payments.put(p);
  await fetchAllPayments();
};

const deletePayment = async (payment: PaymentUI) => {
  await addBalanceToAccount(payment.paymentMethod.account.id, -payment.amount);
  await db.payments.delete(payment.id);
  await fetchAllPayments();
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

export {
  addPayment,
  allPayments,
  deletePayment,
  fetchAllPayments,
  findPayment,
  getDefaultNewPayments,
  updatePayment,
};
