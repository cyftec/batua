import { derived, dpromise } from "@cyftech/signal";
import type { PaymentMethod } from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchAllPaymentMethods, paymentMethodsList] = dpromise(() =>
  db.paymentMethods.getAll()
);

const allPaymentMethods = derived(() => paymentMethodsList.value || []);

const [addPaymentMethod] = dpromise(async (paymentMethod: PaymentMethod) => {
  await db.paymentMethods.add(paymentMethod);
  await fetchAllPaymentMethods();
});

const [editPaymentMethod] = dpromise(async (paymentMethod: PaymentMethod) => {
  await db.paymentMethods.put(paymentMethod);
  await fetchAllPaymentMethods();
});

const [deletePaymentMethod] = dpromise(
  async (paymentMethodId: PaymentMethod["id"]) => {
    await db.paymentMethods.delete(paymentMethodId);
    await fetchAllPaymentMethods();
  }
);

export {
  addPaymentMethod,
  deletePaymentMethod,
  editPaymentMethod,
  fetchAllPaymentMethods,
  allPaymentMethods,
};
