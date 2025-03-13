import { derived, dpromise } from "@cyftech/signal";
import type { PaymentMethodDB, PaymentMethodUI } from "../../@libs/common";
import { db } from "../storage/localdb/setup";
import { allAccounts, fetchAllAccounts } from "./accounts";

const [fetchAllPaymentMethods, paymentMethodsList] = dpromise(async () => {
  if (!allAccounts.value.length) await fetchAllAccounts();
  const paymentMethodsList: PaymentMethodUI[] = (
    await db.paymentMethods.getAll()
  ).map((pm) => ({
    ...pm,
    accounts: allAccounts.value.filter((acc) => pm.accounts.includes(acc.id)),
  }));

  return paymentMethodsList;
});

const allPaymentMethods = derived(() => paymentMethodsList.value || []);

const [addPaymentMethod] = dpromise(async (paymentMethod: PaymentMethodUI) => {
  const pm: PaymentMethodDB = {
    ...paymentMethod,
    accounts: paymentMethod.accounts.map((pmAcc) => pmAcc.id),
  };
  await db.paymentMethods.add(pm);
  await fetchAllPaymentMethods();
});

const [editPaymentMethod] = dpromise(async (paymentMethod: PaymentMethodUI) => {
  const pm: PaymentMethodDB = {
    ...paymentMethod,
    accounts: paymentMethod.accounts.map((pmAcc) => pmAcc.id),
  };
  await db.paymentMethods.put(pm);
  await fetchAllPaymentMethods();
});

const [deletePaymentMethod] = dpromise(
  async (paymentMethodId: PaymentMethodDB["id"]) => {
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
