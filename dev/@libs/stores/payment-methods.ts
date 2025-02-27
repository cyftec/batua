import { dpromise } from "@cyftech/signal";
import type { PaymentMethod } from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchPaymentMethods, paymentMethods] = dpromise(() =>
  db.paymentMethods.getAll()
);

const [addPaymentMethod] = dpromise(async (paymentMethod: PaymentMethod) => {
  await db.paymentMethods.add(paymentMethod);
  await fetchPaymentMethods();
});

const [editPaymentMethod] = dpromise(async (paymentMethod: PaymentMethod) => {
  await db.paymentMethods.put(paymentMethod);
  await fetchPaymentMethods();
});

const [deletePaymentMethod] = dpromise(
  async (paymentMethodId: PaymentMethod["id"]) => {
    await db.paymentMethods.delete(paymentMethodId);
    await fetchPaymentMethods();
  }
);

export {
  addPaymentMethod,
  deletePaymentMethod,
  editPaymentMethod,
  fetchPaymentMethods,
  paymentMethods,
};
