import { DB } from "./db";

type StoreTransaction<Record> = {
  count: (
    key?: IDBValidKey,
    onTransactionComplete?: () => void
  ) => Promise<number>;
  get: (
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
    onTransactionComplete?: () => void
  ) => Promise<Record[]>;
  add: (
    value: Record,
    key?: IDBValidKey,
    onTransactionComplete?: () => void
  ) => Promise<IDBValidKey>;
  update: (
    value: Record,
    key?: IDBValidKey,
    onTransactionComplete?: () => void
  ) => Promise<IDBValidKey>;
  delete: (
    query?: IDBValidKey | IDBKeyRange,
    onTransactionComplete?: () => void
  ) => Promise<undefined>;
  indices: {};
};
type DBSchema<StoreNameOption extends string, R extends object> = Record<
  StoreNameOption,
  StoreTransaction<R>
> & {
  transaction: (stores: StoreNameOption[]) => void;
};

export const openDb = <
  StoreRecord extends object,
  StoreNameOption extends string
>(
  dbName: string,
  dbVersion: number,
  onVersionUpgrade: (db: IDBDatabase, reject: (err: Error) => void) => void,
  stores: StoreNameOption[]
) => {
  const openDb = () => DB.open(dbName, dbVersion, onVersionUpgrade);

  const getTransaction = async <R>(
    storeName: string,
    actionReq: (store: IDBObjectStore) => IDBRequest<R>,
    errMsg: string,
    onTransactionComplete?: () => void
  ) => {
    const db = await openDb();
    const txn = db.transaction(storeName);
    const store = txn.objectStore(storeName);

    return new Promise((resolve: (value: R) => void, reject) => {
      const req = actionReq(store);

      req.onerror = () => reject(new Error(errMsg));

      req.onsuccess = (e) => resolve((e.target as IDBRequest<R>).result);

      txn.oncomplete = () => onTransactionComplete && onTransactionComplete();
    });
  };

  const db = stores.reduce((obj, storeName) => {
    obj[storeName as string] = {
      count: (key?: IDBValidKey, onTransactionComplete?: () => void) =>
        getTransaction<number>(
          storeName,
          (store: IDBObjectStore) => store.count(key),
          `Error counting records in '${storeName}' store`,
          onTransactionComplete
        ),
      get: async (
        query?: IDBValidKey | IDBKeyRange | null,
        count?: number,
        onTransactionComplete?: () => void
      ) =>
        getTransaction<StoreRecord[]>(
          storeName,
          (store: IDBObjectStore) => store.getAll(query, count),
          `Error fetching records in '${storeName}' store`,
          onTransactionComplete
        ),
      // getAll: async () => {},
      // getAllKeys: async () => {},
      // getKey: async () => {},
      // openCursor: async () => {},
      // openKeyCursor: async () => {},
      add: (
        value: StoreRecord,
        key?: IDBValidKey,
        onTransactionComplete?: () => void
      ) =>
        getTransaction<IDBValidKey>(
          storeName,
          (store: IDBObjectStore) => store.add(value, key),
          `Error adding value - ${value} to '${storeName}' store`,
          onTransactionComplete
        ),
      update: async (
        value: StoreRecord,
        key?: IDBValidKey,
        onTransactionComplete?: () => void
      ) =>
        getTransaction<IDBValidKey>(
          storeName,
          (store: IDBObjectStore) => store.put(value, key),
          `Error updating value - ${value} to '${storeName}' store`,
          onTransactionComplete
        ),
      delete: (
        query?: IDBValidKey | IDBKeyRange,
        onTransactionComplete?: () => void
      ) =>
        getTransaction(
          storeName,
          (store: IDBObjectStore) => {
            if (query) {
              return store.delete(query);
            }

            return store.clear();
          },
          `Error deleting records from '${storeName}' store`,
          onTransactionComplete
        ),
      indices: {
        // createIndex: async () => {},
        // deleteIndex: async () => {},
        // index: async () => {},
      },
    };

    return obj;
  }, {} as DBSchema<StoreNameOption, StoreRecord>);

  db["transaction"] = (stores: StoreNameOption[]) => {};

  return db;
};
