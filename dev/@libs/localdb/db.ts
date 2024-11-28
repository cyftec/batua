export class DB {
  static open(
    dbName: string,
    dbVersion: number,
    onpgrade: (db: IDBDatabase, reject: (err: Error) => void) => void
  ) {
    return new Promise(
      (resolve: (db: IDBDatabase) => void, reject: (err: Error) => void) => {
        const dbReq = window.indexedDB.open(dbName, dbVersion);

        dbReq.onerror = () =>
          reject(new Error(`Failed opening '${dbName} v${dbVersion}' db.`));

        dbReq.onsuccess = (e) => {
          const db = (e.target as IDBRequest<IDBDatabase>).result;
          resolve(db);
        };

        dbReq.onupgradeneeded = (e) => {
          const db = (e.target as IDBRequest<IDBDatabase>).result;
          onpgrade(db, reject);
        };
      }
    );
  }
}
