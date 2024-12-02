import { Transaction } from "../common";
import { openDb } from "./dao";

export const DB_NAME = "batua";
export const DB_VERSION = 1;
export const STORES_GENERIC_KEY_PATH = "id";
export const STORES = {
  TRANSACTIONS: "transactions",
} as const;

type StoresKeys = keyof typeof STORES;
export type StoreNameOption = (typeof STORES)[StoresKeys];

export const handleUpgradeV1 = (
  db: IDBDatabase,
  reject: (err: Error) => void
) => {
  const transactionsStoreReq = db.createObjectStore(STORES.TRANSACTIONS, {
    keyPath: STORES_GENERIC_KEY_PATH,
    autoIncrement: true,
  });

  transactionsStoreReq.transaction.onerror = () =>
    reject(
      new Error(
        `error creating '${STORES.TRANSACTIONS}' store on upgrade of '${DB_NAME}' db v${DB_VERSION}`
      )
    );

  transactionsStoreReq.transaction.oncomplete = () =>
    console.log(
      `'${STORES.TRANSACTIONS}' store created for '${DB_NAME}' db v${DB_VERSION}`
    );
};

export const batuaDb = openDb<Transaction, StoreNameOption>(
  DB_NAME,
  DB_VERSION,
  handleUpgradeV1,
  [STORES.TRANSACTIONS]
);
