import { Budget } from "../../../models/data-models";
import { DataStore } from "../../../models/view-models";
import { db } from "../db";
import { getDataStore } from "./data-store";

const _newItem: Budget = {
  id: 0,
  title: "",
  period: "Week",
  amount: 0,
  allOf: [],
  oneOf: [],
};

export const budgetsStore: DataStore<Budget> = getDataStore(
  () => _newItem,
  db.budgets
);
