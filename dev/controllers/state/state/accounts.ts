import { Account } from "../../../models/data-models";
import { DataStore } from "../../../models/view-models";
import { db } from "../db";
import { getDataStore } from "./data-store";

const _newItem: Account = {
  id: 0,
  isPermanent: false,
  type: "expense",
  name: "",
  uniqueId: undefined,
  vault: undefined,
  paymentMethods: [],
};

export const accountsStore: DataStore<Account> = getDataStore(
  () => _newItem,
  db.accounts
);
