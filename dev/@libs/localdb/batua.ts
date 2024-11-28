import { openDb } from "./dao";
import { Expense } from "../models/index.ts";

export const DB_NAME = "batua";
export const DB_VERSION = 1;
export const STORES_GENERIC_KEY_PATH = "id";
export const STORES = {
  EXPENSES: "expenses",
} as const;

type StoresKeys = keyof typeof STORES;
export type StoreNameOption = (typeof STORES)[StoresKeys];

export const handleUpgradeV1 = (
  db: IDBDatabase,
  reject: (err: Error) => void
) => {
  const expensesStoreReq = db.createObjectStore(STORES.EXPENSES, {
    keyPath: STORES_GENERIC_KEY_PATH,
    autoIncrement: true,
  });

  expensesStoreReq.transaction.onerror = () =>
    reject(
      new Error(
        `error creating '${STORES.EXPENSES}' store on upgrade of '${DB_NAME}' db v${DB_VERSION}`
      )
    );

  expensesStoreReq.transaction.oncomplete = () =>
    console.log(
      `'${STORES.EXPENSES}' store created for '${DB_NAME}' db v${DB_VERSION}`
    );
};

export const batuaDb = openDb<Expense, StoreNameOption>(
  DB_NAME,
  DB_VERSION,
  handleUpgradeV1,
  [STORES.EXPENSES]
);
