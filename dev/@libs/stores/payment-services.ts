import { derived, dpromise } from "@cyftech/signal";
import type {
  ID,
  PaymentMethodUI,
  PaymentServiceDB,
  PaymentServiceUI,
} from "../common";
import { db } from "../storage/localdb/setup";
import { allAccounts, fetchAllAccounts } from "./accounts";

const [fetchAllPaymentServices, paymentServicesList] = dpromise(async () => {
  if (!allAccounts.value.length) await fetchAllAccounts();
  const paymentServicesList: PaymentServiceUI[] = (
    await db.paymentServices.getAll()
  ).map((ps) => ({
    ...ps,
    accounts: allAccounts.value.filter((acc) => ps.accounts.includes(acc.id)),
  }));

  return paymentServicesList;
});

const allPaymentServices = derived(() => paymentServicesList.value || []);

const getPaymentMethodUI = (
  paymentServiceId: ID,
  accountId: ID
): PaymentMethodUI => {
  const allPSs = allPaymentServices.value;
  const foundPS = allPSs.find((ps) => ps.id === paymentServiceId);
  const foundAccount = foundPS?.accounts.find((acc) => acc.id === accountId);
  if (!foundPS || !foundAccount)
    throw `No payment-method found with given payment-service and account IDs`;

  return {
    id: foundPS.id,
    name: foundPS.name,
    uniqueId: foundPS.uniqueId,
    account: foundAccount,
  };
};

const [addPaymentService] = dpromise(
  async (paymentService: PaymentServiceUI) => {
    const ps: PaymentServiceDB = {
      ...paymentService,
      accounts: paymentService.accounts.map((pmAcc) => pmAcc.id),
    };
    await db.paymentServices.add(ps);
    await fetchAllPaymentServices();
  }
);

const [editPaymentService] = dpromise(
  async (paymentService: PaymentServiceUI) => {
    const ps: PaymentServiceDB = {
      ...paymentService,
      accounts: paymentService.accounts.map((pmAcc) => pmAcc.id),
    };
    await db.paymentServices.put(ps);
    await fetchAllPaymentServices();
  }
);

const [deletePaymentService] = dpromise(
  async (paymentServiceId: PaymentServiceDB["id"]) => {
    await db.paymentServices.delete(paymentServiceId);
    await fetchAllPaymentServices();
  }
);

export {
  addPaymentService,
  deletePaymentService,
  editPaymentService,
  getPaymentMethodUI,
  fetchAllPaymentServices,
  allPaymentServices,
};
