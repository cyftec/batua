import { DB } from "./database";
import type {
  DbConfig,
  DBSchema,
  Doc,
  IdxName,
  ObjectStoreTransaction,
} from "./types";

export const openDb = <Conf extends DbConfig>(
  dbName: string,
  dbVersion: number,
  config: Conf,
  onVersionUpgrade: (db: IDBDatabase, reject: (err: Error) => void) => void
): DBSchema<Conf> => {
  const storeNames = Object.keys(config) as (keyof Conf)[];

  const database = storeNames.reduce((dbObject, storeName) => {
    const getTransaction = async <R>(
      actionReq: (store: IDBObjectStore) => IDBRequest<R>,
      mode: IDBTransactionMode,
      errMsg: string
    ) => {
      const db = await DB.open(dbName, dbVersion, onVersionUpgrade);
      db.onerror = () => console.error(`Error opening '${dbName}' db`);
      const txn = db.transaction(storeName as string, mode);
      txn.onerror = () =>
        console.error(`Error initializing transaction. ${errMsg}`);
      const store = txn.objectStore(storeName as string);

      return new Promise((resolve: (value: R) => void, reject) => {
        const req = actionReq(store);
        req.onerror = () => reject(new Error(errMsg));
        req.onsuccess = (e) => resolve((e.target as IDBRequest<R>).result);
      });
    };

    dbObject[storeName] = {
      add: (value: Doc<typeof storeName, Conf>, key?: IDBValidKey) =>
        getTransaction<IDBValidKey>(
          (store: IDBObjectStore) => store.add(value, key),
          "readwrite",
          `Error adding value - ${value} to '${storeName as string}' store`
        ),
      clear: () =>
        getTransaction(
          (store: IDBObjectStore) => store.clear(),
          "readonly",
          `Error clearing records in '${storeName as string}' store`
        ),
      count: (query?: IDBValidKey | IDBKeyRange) =>
        getTransaction<number>(
          (store: IDBObjectStore) => store.count(query),
          "readonly",
          `Error counting records in '${storeName as string}' store`
        ),
      delete: (query: IDBValidKey | IDBKeyRange) =>
        getTransaction(
          (store: IDBObjectStore) => store.delete(query),
          "readwrite",
          `Error deleting records from '${storeName as string}' store`
        ),
      get: async (query: IDBValidKey | IDBKeyRange) =>
        getTransaction<Doc<typeof storeName, Conf>>(
          (store: IDBObjectStore) => store.get(query),
          "readonly",
          `Error fetching specific record from '${storeName as string}' store`
        ),
      getAll: async (
        query?: IDBValidKey | IDBKeyRange | null,
        count?: number
      ) =>
        getTransaction<Doc<typeof storeName, Conf>[]>(
          (store: IDBObjectStore) => store.getAll(query, count),
          "readonly",
          `Error fetching all records from '${storeName as string}' store`
        ),
      getAllKeys: async (
        query?: IDBValidKey | IDBKeyRange | null,
        count?: number
      ) =>
        getTransaction<IDBValidKey[]>(
          (store: IDBObjectStore) => store.getAllKeys(query, count),
          "readonly",
          `Error fetching multiple keys from '${storeName as string}' store`
        ),
      getKey: async (query: IDBValidKey | IDBKeyRange) =>
        getTransaction<IDBValidKey | undefined>(
          (store: IDBObjectStore) => store.getKey(query),
          "readonly",
          `Error fetching specific key from '${storeName as string}' store`
        ),
      put: async (value: Doc<typeof storeName, Conf>, key?: IDBValidKey) =>
        getTransaction<IDBValidKey>(
          (store: IDBObjectStore) => store.put(value, key),
          "readwrite",
          `Error updating value - ${value} to '${storeName as string}' store`
        ),
      indices: config[storeName].indices.reduce((map, idx) => {
        const indexName = Object.entries(idx)[0][0] as IdxName<Conf>;

        map[indexName] = {
          count: async (query?: IDBValidKey | IDBKeyRange) =>
            getTransaction<number>(
              (store: IDBObjectStore) =>
                store.index(indexName as string).count(query),
              "readonly",
              `Error counting records in '${storeName as string}.${
                indexName as string
              }' index`
            ),
          get: async (query: IDBValidKey | IDBKeyRange) =>
            getTransaction<Doc<typeof storeName, Conf>>(
              (store: IDBObjectStore) =>
                store.index(indexName as string).get(query),
              "readonly",
              `Error fetching specific record from '${storeName as string}.${
                indexName as string
              }' index`
            ),
          getAll: async (
            query?: IDBValidKey | IDBKeyRange | null,
            count?: number
          ) =>
            getTransaction<Doc<typeof storeName, Conf>[]>(
              (store: IDBObjectStore) =>
                store.index(indexName as string).getAll(query, count),
              "readonly",
              `Error fetching all records from '${storeName as string}.${
                indexName as string
              }' index`
            ),
          getAllKeys: async (
            query?: IDBValidKey | IDBKeyRange | null,
            count?: number
          ) =>
            getTransaction<IDBValidKey[]>(
              (store: IDBObjectStore) => store.getAllKeys(query, count),
              "readonly",
              `Error fetching multiple keys from '${storeName as string}.${
                indexName as string
              }' index`
            ),
          getKey: async (query: IDBValidKey | IDBKeyRange) =>
            getTransaction<IDBValidKey | undefined>(
              (store: IDBObjectStore) => store.getKey(query),
              "readonly",
              `Error fetching specific key from '${storeName as string}.${
                indexName as string
              }' index`
            ),
        };
        return map;
      }, {} as ObjectStoreTransaction<keyof Conf, Conf>["indices"]),
    };

    return dbObject;
  }, {} as DBSchema<Conf>);

  return database;
};
