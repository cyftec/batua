import { db } from "..";
import { Txn } from "../../../models/data-models";
import { DataStore } from "../../../models/view-models";
import { getDataStore } from "./data-store";

const getNewItem = (): Txn => {
  const now = new Date();

  return {
    id: 0,
    date: now,
    created: now,
    modified: now,
    type: "expense",
    payments: [],
    tags: [],
    title: {
      id: 0,
      value: "",
    },
  };
};

export const txnsStore: DataStore<Txn> = getDataStore(getNewItem, db.txns);
