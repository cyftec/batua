import { KvStore } from "./kv-stores";
import { getKvStoreIDManager } from "./kvs-id-manager";
import {
  DbUnsupportedType,
  Extend,
  ID_KEY,
  PLAIN_EXTENDED_RECORD_VALUE_KEY,
  TableKey,
  DbRecordID,
} from "./models";
import {
  getMappedObject,
  getKvsRecordIDFromDbRecordID,
  getDbRecordIDFromKvsRecordID,
  getExtendedValue,
  getJsValue,
} from "./transforms";

type RecordMatcher<ExtendedRecord> = (record: ExtendedRecord) => boolean;

type GetResponse<In, ExtendedRecord> = In extends DbRecordID
  ? ExtendedRecord | undefined
  : ExtendedRecord[];

export type Table<RawRecord, ExtendedRecord extends Extend<RawRecord>> = {
  length: number;
  get: <In extends DbRecordID | DbRecordID[]>(
    input: In,
    count?: number
  ) => GetResponse<In, ExtendedRecord>;
  set: (
    id: DbRecordID,
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
  push: (record: RawRecord) => DbRecordID;
  pop: (dbRecordID: DbRecordID) => void;
};

export const createTable = <
  RawRecord,
  ExtendedRecord extends Extend<RawRecord>
>(
  kvStore: KvStore,
  tableKey: TableKey,
  getForeignTableFromKey: (tableKey: TableKey) => Table<any, any>,
  foreignKeyMappings?: Partial<{ [k in keyof RawRecord]: TableKey }>,
  dbToJsTypeMappings?: Partial<{ [k in keyof RawRecord]: DbUnsupportedType }>
): Table<RawRecord, ExtendedRecord> => {
  const kvsIdManager = getKvStoreIDManager(kvStore);

  const getAllIDs = () => {
    const kvStoreRecordIDs = kvStore.getAllKeys();
    const validIDs: DbRecordID[] = [];
    for (const id of kvStoreRecordIDs) {
      const validDbRecordID = getDbRecordIDFromKvsRecordID(tableKey, id);
      if (validDbRecordID === undefined) continue;
      validIDs.push(validDbRecordID);
    }
    return validIDs;
  };

  const getRecordsLength = () => {
    return getAllIDs().length;
  };

  const getRawRecord = (id: DbRecordID) => {
    const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, id);
    const kvsRecordValue = kvStore.getItem(kvsRecordID);
    if (kvsRecordValue === undefined) return;
    const record = JSON.parse(kvsRecordValue);
    return record as RawRecord;
  };

  const getRecord = (id: DbRecordID) => {
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

  const getAllRecords = (ids: DbRecordID[]) => {
    if (!Array.isArray(ids))
      throw `Invalid 'ids' passed for getting records list. It should be an array.`;
    const validIDs: DbRecordID[] = ids.length ? ids : getAllIDs();
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
    const validIDs: DbRecordID[] = getAllIDs();
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
    const dbRecordID = kvsIdManager.useNewID((newDbRecordID) => {
      const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, newDbRecordID);
      const kvsRecordValue = JSON.stringify(record);
      kvStore.setItem(kvsRecordID, kvsRecordValue);
    });
    return dbRecordID;
  };

  const setRecord = (
    id: DbRecordID,
    newOrPartiallyNewRecord: RawRecord extends object
      ? Partial<RawRecord>
      : RawRecord
  ) => {
    const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, id);
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

  const deleteRecord = (dbRecordID: DbRecordID) => {
    const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, dbRecordID);
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
