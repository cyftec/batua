import { Payment } from "../../../models/data-models";
import { DataStore } from "../../../models/view-models";
import { db } from "../db";
import { accountsStore } from "./accounts";
import { getDataStore } from "./data-store";

const getNewItem = (): Payment => {
  const firstAccount = accountsStore.list.value[0];

  return {
    id: 0,
    amount: 0,
    account: firstAccount,
    via: firstAccount.paymentMethods?.[0],
  };
};

export const paymentsStore: DataStore<Payment> = getDataStore(
  getNewItem,
  db.payments
);
