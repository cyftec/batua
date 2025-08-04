import { KvStore } from "./kv-stores";
import { getKvStoreIDManager } from "./kvs-id-manager";
import {
  DbUnsupportedType,
  Extend,
  ID_KEY,
  UNSTRUCTURED_RECORD_VALUE_KEY,
  TableKey,
  DbRecordID,
  UnstructuredExtendedRecord,
} from "./models";
import {
  getMappedObject,
  getKvsRecordIDFromDbRecordID,
  getDbRecordIDFromKvsRecordID,
  getExtendedValue,
  getJsValue,
  getDbForeignIdValue,
  getDbValue,
} from "./transforms";
import { unstructuredValue } from "./utils";

type RecordMatcher<ExtendedRecord> = (record: ExtendedRecord) => boolean;

type GetResponse<In, ExtendedRecord> = undefined extends In
  ? ExtendedRecord[]
  : In extends DbRecordID
  ? ExtendedRecord | undefined
  : ExtendedRecord[];

export type Table<RawRecord, ExtendedRecord extends Extend<RawRecord>> = {
  length: number;
  get: <In extends DbRecordID | DbRecordID[] | undefined>(
    input?: In
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
  push: (record: RawRecord) => ExtendedRecord;
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

  const getDbFormatRecord = (record: object) => {
    if (foreignKeyMappings) {
      Object.keys(foreignKeyMappings).forEach((keysPath) => {
        const keysPathArray = keysPath.split(".");
        record = getMappedObject(getDbForeignIdValue, record, keysPathArray);
      });
    }

    if (dbToJsTypeMappings) {
      Object.keys(dbToJsTypeMappings).forEach((keysPath) => {
        const keysPathArray = keysPath.split(".");
        record = getMappedObject(getDbValue, record, keysPathArray);
      });
    }

    return record;
  };

  const getUiFormatRecord = (record: object) => {
    if (foreignKeyMappings) {
      Object.keys(foreignKeyMappings).forEach((keysPath) => {
        const foreignTableKey = foreignKeyMappings[keysPath] as TableKey;
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
        const jsType = dbToJsTypeMappings[keysPath] as DbUnsupportedType;
        const keysPathArray = keysPath.split(".");
        record = getMappedObject(
          (rawValue) => getJsValue(rawValue, jsType),
          record,
          keysPathArray
        );
      });
    }

    return record;
  };

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

  const getRawRecord = (id: DbRecordID) => {
    const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, id);
    const kvsRecordValue = kvStore.getItem(kvsRecordID);
    if (kvsRecordValue === undefined) return;
    const record = JSON.parse(kvsRecordValue);
    return record as RawRecord;
  };

  const getSingleRecord = (id: DbRecordID) => {
    let rawRecord = getRawRecord(id);
    if (!rawRecord) return;

    if (typeof rawRecord !== "object") {
      return {
        [ID_KEY]: id,
        [UNSTRUCTURED_RECORD_VALUE_KEY]: rawRecord as RawRecord,
      } as unknown as ExtendedRecord;
    }

    const uiFormatRecord = getUiFormatRecord(rawRecord);
    return { id, ...uiFormatRecord } as unknown as ExtendedRecord;
  };

  const getAllRecords = (ids?: DbRecordID[]) => {
    const validIDs: DbRecordID[] = ids?.length ? ids : getAllIDs();
    const records: ExtendedRecord[] = [];
    for (const id of validIDs) {
      const record = getSingleRecord(id);
      if (!record) continue;
      records.push(record);
    }
    return records;
  };

  const getRecord = <In extends DbRecordID | DbRecordID[] | undefined>(
    input?: In
  ) => {
    return (
      typeof input === "number" ? getSingleRecord(input) : getAllRecords(input)
    ) as GetResponse<In, ExtendedRecord>;
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
      const record = getSingleRecord(id);
      if (!record) continue;
      const recordMatched = recordMatcher(record);
      if (recordMatched) matchingRecords.push(record);
      if (matchingRecords.length === recordsLength) break;
    }
    return matchingRecords;
  };

  const findRecord = (
    recordMatcher: RecordMatcher<ExtendedRecord>
  ): ExtendedRecord | undefined => getAllWhere(recordMatcher, 1)[0];

  const addRecord = (rawRecord: RawRecord) => {
    if (typeof rawRecord !== "object") {
      const existingRawRecord = findRecord(
        (rec) =>
          unstructuredValue(rec as UnstructuredExtendedRecord<any>) ===
          rawRecord
      );
      if (existingRawRecord)
        throw `A unstructured record with same value - '${rawRecord}' already exists.`;
    }
    const dbRecordID = kvsIdManager.useNewID((newDbRecordID) => {
      const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, newDbRecordID);
      const dbRecord =
        typeof rawRecord === "object" && rawRecord !== null
          ? getDbFormatRecord(rawRecord)
          : rawRecord;
      const kvsRecordValue = JSON.stringify(dbRecord);
      kvStore.setItem(kvsRecordID, kvsRecordValue);
    });
    return getRecord(dbRecordID) as ExtendedRecord;
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
      typeof previousRecord === "object" && previousRecord !== null
        ? getDbFormatRecord({
            ...previousRecord,
            ...newOrPartiallyNewRecord,
          })
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
      return getAllIDs().length;
    },
    get: getRecord,
    set: setRecord,
    find: findRecord,
    filter: getAllWhere,
    push: addRecord,
    pop: deleteRecord,
  };
};
