import { PaymentMethod } from "../../../models/data-models";
import { DataStore } from "../../../models/view-models";
import { db } from "../db";
import { getDataStore } from "./data-store";

const _newItem: PaymentMethod = {
  id: 0,
  isPermanent: false,
  name: "",
  type: "digital",
};

export const paymentMethodsStore: DataStore<PaymentMethod> = getDataStore(
  () => _newItem,
  db.paymentMethods
);
