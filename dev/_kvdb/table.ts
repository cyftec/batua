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
  getMappedObject,
  getKVSRecordIDFromTableRecordID,
  getTableRecordIDFromKVSRecordID,
  getExtendedValue,
  getJsValue,
} from "./transforms";

type RecordMatcher<ExtendedRecord> = (record: ExtendedRecord) => boolean;

type GetResponse<In, ExtendedRecord> = In extends TableRecordID
  ? ExtendedRecord | undefined
  : ExtendedRecord[];

export type Table<RawRecord, ExtendedRecord extends Extend<RawRecord>> = {
  length: number;
  get: <In extends TableRecordID | TableRecordID[]>(
    input: In,
    count?: number
  ) => GetResponse<In, ExtendedRecord>;
  set: (
    id: TableRecordID,
    newOrPartiallyNewRecord: RawRecord extends object
      ? Partial<RawRecord>
      : RawRecord
  ) => void;
  find: (
    recordMatcher: RecordMatcher<ExtendedRecord>
  ) => ExtendedRecord | undefined;
  filter: (
    recordMatcher: RecordMatcher<ExtendedRecord>,
    count?: number
  ) => ExtendedRecord[];
  push: (record: RawRecord) => TableRecordID;
  pop: (tableRecordID: TableRecordID) => void;
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

  const getAllIDs = () => {
    const kvStoreRecordIDs = kvStore.getAllKeys();
    const validIDs: TableRecordID[] = [];
    for (const id of kvStoreRecordIDs) {
      const validTableRecordID = getTableRecordIDFromKVSRecordID(tableKey, id);
      if (validTableRecordID === undefined) continue;
      validIDs.push(validTableRecordID);
    }
    return validIDs;
  };

  const getRecordsLength = () => {
    return getAllIDs().length;
  };

  const getRawRecord = (id: TableRecordID) => {
    const kvsRecordID = getKVSRecordIDFromTableRecordID(tableKey, id);
    const kvsRecordValue = kvStore.getItem(kvsRecordID);
    if (kvsRecordValue === undefined) return;
    const record = JSON.parse(kvsRecordValue);
    return record as RawRecord;
  };

  const getRecord = (id: TableRecordID) => {
    let record = getRawRecord(id);

    if (!record) return;

    if (typeof record !== "object") {
      return {
        [ID_KEY]: id,
        [PLAIN_EXTENDED_RECORD_VALUE_KEY]: record as RawRecord,
      } as unknown as ExtendedRecord;
    }

    if (foreignKeyMappings) {
      Object.keys(foreignKeyMappings).forEach((keysPath) => {
        if (!record) return;
        const foreignTableKey = foreignKeyMappings[keysPath] as string;
        const foreignTable = getForeignTableFromKey(foreignTableKey);
        const keysPathArray = keysPath.split(".");
        record = getMappedObject(
          (rawValue) => getExtendedValue(foreignTable, rawValue),
          record,
          keysPathArray
        );
      });
    }

    if (dbToJsTypeMappings) {
      Object.keys(dbToJsTypeMappings).forEach((keysPath) => {
        if (!record) return;
        const jsType = dbToJsTypeMappings[keysPath] as DbUnsupportedType;
        const keysPathArray = keysPath.split(".");
        record = getMappedObject(
          (rawValue) => getJsValue(rawValue, jsType),
          record,
          keysPathArray
        );
      });
    }

    return { id, ...record } as unknown as ExtendedRecord;
  };

  const getAllRecords = (ids: TableRecordID[]) => {
    if (!Array.isArray(ids))
      throw `Invalid 'ids' passed for getting records list. It should be an array.`;
    const validIDs: TableRecordID[] = ids.length ? ids : getAllIDs();
    const records: ExtendedRecord[] = [];
    for (const id of validIDs) {
      const record = getRecord(id);
      if (!record) continue;
      records.push(record);
    }
    return records;
  };

  const getAllWhere = (
    recordMatcher: RecordMatcher<ExtendedRecord>,
    count?: number
  ) => {
    const validIDs: TableRecordID[] = getAllIDs();
    const matchingRecords: ExtendedRecord[] = [];
    const idsLength = validIDs.length;
    const recordsLength = count || idsLength;
    for (const id of validIDs) {
      const record = getRecord(id);
      if (!record) continue;
      const recordMatched = recordMatcher(record);
      if (recordMatched) matchingRecords.push(record);
      if (matchingRecords.length === recordsLength) break;
    }
    return matchingRecords;
  };

  const addRecord = (record: RawRecord) => {
    const tableRecordID = kvsIdManager.useNewID((newTableRecordID) => {
      const kvsRecordID = getKVSRecordIDFromTableRecordID(
        tableKey,
        newTableRecordID
      );
      const kvsRecordValue = JSON.stringify(record);
      kvStore.setItem(kvsRecordID, kvsRecordValue);
    });
    return tableRecordID;
  };

  const setRecord = (
    id: TableRecordID,
    newOrPartiallyNewRecord: RawRecord extends object
      ? Partial<RawRecord>
      : RawRecord
  ) => {
    const kvsRecordID = getKVSRecordIDFromTableRecordID(tableKey, id);
    const previousRecord = getRawRecord(id);
    if (previousRecord === undefined) throw `No record found for id - '${id}'`;
    const newRecord =
      typeof previousRecord === "object"
        ? {
            ...previousRecord,
            ...newOrPartiallyNewRecord,
          }
        : newOrPartiallyNewRecord;

    const newKvsRecordValue: string = JSON.stringify(newRecord);
    kvStore.setItem(kvsRecordID, newKvsRecordValue);
  };

  const deleteRecord = (tableRecordID: TableRecordID) => {
    const kvsRecordID = getKVSRecordIDFromTableRecordID(
      tableKey,
      tableRecordID
    );
    kvStore.removeItem(kvsRecordID);
  };

  return {
    get length() {
      return getRecordsLength();
    },
    get: function (input) {
      if (typeof input === "number") {
        return getRecord(input) as GetResponse<typeof input, ExtendedRecord>;
      }
      return getAllRecords(input) as GetResponse<typeof input, ExtendedRecord>;
    },
    set: setRecord,
    find: function (recordMatcher) {
      return getAllWhere(recordMatcher, 1)[0];
    },
    filter: getAllWhere,
    push: addRecord,
    pop: deleteRecord,
  };
};
