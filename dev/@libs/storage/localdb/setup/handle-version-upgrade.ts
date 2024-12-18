import { getCreateIndexOption, getKeyPaths } from "../libs/utils";
import { DB_NAME, DB_VERSION, DB_CONFIG } from "./db-config";

export const handleUpgradeV1 = (
  db: IDBDatabase,
  reject: (err: Error) => void
) => {
  Object.entries(DB_CONFIG).forEach(([storeName, options]) => {
    const { keyPathsShorthand, indices } = options;
    const storeReq = db.createObjectStore(storeName, {
      keyPath: getKeyPaths(keyPathsShorthand),
      autoIncrement: false,
    });
    storeReq.transaction.onerror = () =>
      reject(
        new Error(
          `error creating '${storeName}' store on upgrade of '${DB_NAME}' db v${DB_VERSION}`
        )
      );

    (indices as (typeof options)["indices"]).forEach((idx) => {
      const [indexName, indexShorthand] = Object.entries(idx)[0];
      const [keyPathsShorthand, option] = (indexShorthand as string).split("|");
      storeReq.createIndex(
        indexName,
        getKeyPaths(keyPathsShorthand),
        getCreateIndexOption(option)
      );
    });

    storeReq.transaction.oncomplete = () =>
      console.log(
        `'${storeName}' store created for '${DB_NAME}' db v${DB_VERSION}`
      );
  });
};
