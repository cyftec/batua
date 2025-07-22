import { KVStore } from "./kv-stores";
import { getKVStoreIDManager } from "./kvs-id-manager";
import {
  DbUnsupportedType,
  Extend,
  ID_KEY,
  PLAIN_EXTENDED_RECORD_VALUE_KEY,
  TableKey,
  TableRecordID,
} from "./models";
import {
  getKVSRecordIDFromTableRecordID,
  getTableRecordIDFromKVSRecordID,
} from "./transforms";

export type Table<RawRecord, ExtendedRecord extends Extend<RawRecord>> = {
  isEmpty: () => boolean;
  getAllIDs: () => TableRecordID[];
  getRaw: (id: TableRecordID) => RawRecord | undefined;
  get: (id: TableRecordID) => ExtendedRecord | undefined;
  getAll: (ids?: TableRecordID[]) => ExtendedRecord[];
  getAllWhere: (
    recordMatcher: (record: ExtendedRecord) => boolean,
    option?: { count?: number }
  ) => ExtendedRecord[];
  getWhere: (
    recordMatcher: (record: ExtendedRecord) => boolean
  ) => ExtendedRecord | undefined;
  add: (record: RawRecord) => TableRecordID;
  update: (
    id: TableRecordID,
    newOrPartiallyNewRecord: RawRecord extends object
      ? Partial<RawRecord>
      : RawRecord
  ) => void;
  delete: (tableRecordID: TableRecordID) => void;
};

export const createTable = <
  RawRecord,
  ExtendedRecord extends Extend<RawRecord>
>(
  kvStore: KVStore,
  tableKey: TableKey,
  getForeignTableFromKey: (tableKey: TableKey) => Table<any, any>,
  foreignKeyMappings?: Partial<{ [k in keyof RawRecord]: TableKey }>,
  dbToJsTypeMappings?: Partial<{ [k in keyof RawRecord]: DbUnsupportedType }>
): Table<RawRecord, ExtendedRecord> => {
  const kvsIdManager = getKVStoreIDManager(kvStore);

  return {
    isEmpty: function () {
      const thisTable = this as Table<RawRecord, ExtendedRecord>;
      const validKeys = thisTable.getAllIDs();
      return validKeys.length === 0;
    },
    getAllIDs: function () {
      const kvStoreRecordIDs = kvStore.getAllKeys();
      const validIDs: TableRecordID[] = [];
      for (const id of kvStoreRecordIDs) {
        const validTableRecordID = getTableRecordIDFromKVSRecordID(
          tableKey,
          id
        );
        if (validTableRecordID === undefined) continue;
        validIDs.push(validTableRecordID);
      }
      return validIDs;
    },
    getRaw: function (id: TableRecordID) {
      const kvsRecordID = getKVSRecordIDFromTableRecordID(tableKey, id);
      const kvsRecordValue = kvStore.getItem(kvsRecordID);
      if (kvsRecordValue === undefined) return;
      const record = JSON.parse(kvsRecordValue);
      return record as RawRecord;
    },
    get: function (id: TableRecordID) {
      const thisTable = this as Table<RawRecord, ExtendedRecord>;
      const record = thisTable.getRaw(id);

      if (!record) return;

      if (typeof record !== "object") {
        return {
          [ID_KEY]: id,
          [PLAIN_EXTENDED_RECORD_VALUE_KEY]: record as RawRecord,
        } as unknown as ExtendedRecord;
      }

      if (foreignKeyMappings) {
        Object.entries(foreignKeyMappings).forEach(([key, foreignTableKey]) => {
          // rawRecordValue can only be undefined | TableRecordID | TableRecordID[]
          const rawRecordValue = record[key];
          const foreignTable = getForeignTableFromKey(
            foreignTableKey as string
          );

          if (typeof rawRecordValue === "number") {
            record[key] = foreignTable.get(rawRecordValue as TableRecordID);
          }

          if (Array.isArray(rawRecordValue)) {
            record[key] = foreignTable.getAll(
              rawRecordValue as TableRecordID[]
            );
          }
        });
      }

      if (dbToJsTypeMappings) {
        Object.entries(dbToJsTypeMappings).forEach(([key, jsType]) => {
          // rawRecordValue can only be one of DbUnsupportedType
          const rawRecordValue = record[key];
          if (typeof rawRecordValue === "number" && jsType === "Date") {
            record[key] = new Date(rawRecordValue);
          }
        });
      }

      return { id, ...record } as unknown as ExtendedRecord;
    },
    getAll: function (ids?: TableRecordID[]) {
      const thisTable = this as Table<RawRecord, ExtendedRecord>;
      const validIDs: TableRecordID[] = ids || thisTable.getAllIDs();
      const records: ExtendedRecord[] = [];
      for (const id of validIDs) {
        const record = thisTable.get(id);
        if (!record) continue;
        records.push(record);
      }
      return records;
    },
    getAllWhere: function (recordMatcher, options) {
      const thisTable = this as Table<RawRecord, ExtendedRecord>;
      const validIDs: TableRecordID[] = thisTable.getAllIDs();
      const matchingRecords: ExtendedRecord[] = [];
      const idsLength = validIDs.length;
      const recordsLength = options?.count || idsLength;
      for (const id of validIDs) {
        const record = thisTable.get(id);
        if (!record) continue;
        const recordMatched = recordMatcher(record);
        if (recordMatched) matchingRecords.push(record);
        if (matchingRecords.length === recordsLength) break;
      }
      return matchingRecords;
    },
    getWhere: function (recordMatcher) {
      const thisTable = this as Table<RawRecord, ExtendedRecord>;
      return thisTable.getAllWhere(recordMatcher, { count: 1 })[0];
    },
    add: function (record: RawRecord) {
      const tableRecordID = kvsIdManager.useNewID((newTableRecordID) => {
        const kvsRecordID = getKVSRecordIDFromTableRecordID(
          tableKey,
          newTableRecordID
        );
        const kvsRecordValue = JSON.stringify(record);
        kvStore.setItem(kvsRecordID, kvsRecordValue);
      });
      return tableRecordID;
    },
    update: function (
      id: TableRecordID,
      newOrPartiallyNewRecord: RawRecord extends object
        ? Partial<RawRecord>
        : RawRecord
    ) {
      const thisTable = this as Table<RawRecord, ExtendedRecord>;
      const kvsRecordID = getKVSRecordIDFromTableRecordID(tableKey, id);
      const previousRecord = thisTable.getRaw(id);
      if (previousRecord === undefined)
        throw `No record found for id - '${id}'`;
      const newRecord =
        typeof previousRecord === "object"
          ? {
              ...previousRecord,
              ...newOrPartiallyNewRecord,
            }
          : newOrPartiallyNewRecord;

      const newKvsRecordValue: string = JSON.stringify(newRecord);
      kvStore.setItem(kvsRecordID, newKvsRecordValue);
    },
    delete: function (tableRecordID: TableRecordID) {
      const kvsRecordID = getKVSRecordIDFromTableRecordID(
        tableKey,
        tableRecordID
      );
      kvStore.removeItem(kvsRecordID);
    },
  };
};
