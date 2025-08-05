import { KvStore } from "./kv-stores";
import { getKvStoreIDManager } from "./kvs-id-manager";
import {
  DbRecord,
  DbRecordID,
  DbUnsupportedType,
  ID_KEY,
  TableKey,
  UNSTRUCTURED_RECORD_VALUE_KEY,
  Unstructured,
} from "./models";
import {
  getDbRecordIDFromKvsRecordID,
  getDbValue,
  getExtendedValue,
  getForeignDbRecordIdValues,
  getJsValue,
  getKvsRecordIDFromDbRecordID,
  getMappedObject,
} from "./transforms";
import { isRecordNew, isUnstructuredRecord, unstructuredValue } from "./utils";

type RecordMatcher<DatabaseRecord> = (record: DatabaseRecord) => boolean;

type GetResponse<ReqIDs, DatabaseRecord> = undefined extends ReqIDs
  ? DatabaseRecord[]
  : ReqIDs extends DbRecordID
  ? DatabaseRecord | undefined
  : DatabaseRecord[];

export type Table<DatabaseRecord extends DbRecord<any>> = {
  length: number;
  get: <ReqIDs extends DbRecordID | DbRecordID[] | undefined>(
    requestedIDorIDs?: ReqIDs
  ) => GetResponse<ReqIDs, DatabaseRecord>;
  set: (
    id: DbRecordID,
    newOrPartiallyNewRecord: Partial<DatabaseRecord>
  ) => void;
  find: (
    recordMatcher: RecordMatcher<DatabaseRecord>
  ) => DatabaseRecord | undefined;
  filter: (
    recordMatcher: RecordMatcher<DatabaseRecord>,
    count?: number
  ) => DatabaseRecord[];
  push: (record: DatabaseRecord) => DatabaseRecord;
  pop: (dbRecordID: DbRecordID) => void;
};

export const createTable = <DatabaseRecord extends DbRecord<any>>(
  kvStore: KvStore,
  tableKey: TableKey,
  isUnstructured: boolean,
  getForeignTableFromKey: (tableKey: TableKey) => Table<DbRecord<any>>,
  foreignKeyMappings?: Partial<{ [k in keyof DatabaseRecord]: TableKey }>,
  dbToJsTypeMappings?: Partial<{
    [k in keyof DatabaseRecord]: DbUnsupportedType;
  }>
): Table<DatabaseRecord> => {
  const kvsIdManager = getKvStoreIDManager(kvStore);

  const getDbFormatRecord = (record: object) => {
    if (foreignKeyMappings) {
      Object.keys(foreignKeyMappings).forEach((keysPath) => {
        const keysPathArray = keysPath.split(".");
        record = getMappedObject(
          getForeignDbRecordIdValues,
          record,
          keysPathArray
        );
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

  const getAllIDs = (): DbRecordID[] => {
    const kvStoreRecordIDs = kvStore.getAllKeys();
    const validIDs: DbRecordID[] = [];
    for (const id of kvStoreRecordIDs) {
      const validDbRecordID = getDbRecordIDFromKvsRecordID(tableKey, id);
      if (validDbRecordID === undefined) continue;
      validIDs.push(validDbRecordID);
    }
    return validIDs;
  };

  const getRawRecord = (id: DbRecordID): any => {
    const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, id);
    const kvsRecordValue = kvStore.getItem(kvsRecordID);
    if (kvsRecordValue === undefined) return;
    const record = JSON.parse(kvsRecordValue);
    return record;
  };

  const getSingleRecord = (id: DbRecordID): DatabaseRecord | undefined => {
    let rawRecord = getRawRecord(id);
    if (!rawRecord) return;

    if (isUnstructured) {
      return {
        [ID_KEY]: id,
        [UNSTRUCTURED_RECORD_VALUE_KEY]: rawRecord,
      } as unknown as DatabaseRecord;
    }

    const uiFormatRecord = getUiFormatRecord(rawRecord);
    return { id, ...uiFormatRecord } as unknown as DatabaseRecord;
  };

  const getAllRecords = (ids?: DbRecordID[]): DatabaseRecord[] => {
    const validIDs: DbRecordID[] = ids?.length ? ids : getAllIDs();
    const records: DatabaseRecord[] = [];
    for (const id of validIDs) {
      const record = getSingleRecord(id);
      if (!record) continue;
      records.push(record);
    }
    return records;
  };

  const getRecord = <ReqIDs extends DbRecordID | DbRecordID[] | undefined>(
    requestedIDorIDs?: ReqIDs
  ): GetResponse<ReqIDs, DatabaseRecord> => {
    return (
      typeof requestedIDorIDs === "number"
        ? getSingleRecord(requestedIDorIDs)
        : getAllRecords(requestedIDorIDs)
    ) as GetResponse<ReqIDs, DatabaseRecord>;
  };

  const getAllWhere = (
    recordMatcher: RecordMatcher<DatabaseRecord>,
    count?: number
  ): DatabaseRecord[] => {
    const validIDs: DbRecordID[] = getAllIDs();
    const matchingRecords: DatabaseRecord[] = [];
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
    recordMatcher: RecordMatcher<DatabaseRecord>
  ): DatabaseRecord | undefined => getAllWhere(recordMatcher, 1)[0];

  const validateExistingUnstructuredRecord = (record: Unstructured<any>) => {
    const existingRecord = findRecord(
      (rec) =>
        unstructuredValue(rec as Unstructured<any>) ===
        unstructuredValue(record)
    );
    if (existingRecord)
      throw `A unstructured record with same value - '${record}' already exists.`;
  };

  const validateRecordStructure = (
    record: DbRecord<any>,
    isUnstructured: boolean
  ) => {
    if (isUnstructured !== isUnstructuredRecord(record))
      throw `Unstructured or Strucutured type is not matching with passed record. This table is defined as '${
        isUnstructured ? "Unstructured" : "Strucutured"
      }' while the record passed is of the '${
        isUnstructured ? "Strucutured" : "Unstructured"
      }' type.\n${JSON.stringify(record)}`;
  };

  const validateNewRecord = (
    record: DbRecord<any>,
    isUnstructured: boolean
  ) => {
    if (!isRecordNew(record)) throw `Not a new record`;
    validateRecordStructure(record, isUnstructured);
    if (isUnstructured)
      validateExistingUnstructuredRecord(record as Unstructured<any>);
  };

  const addRecord = (record: DatabaseRecord): DatabaseRecord => {
    validateNewRecord(record, isUnstructured);
    const dbRecordID = kvsIdManager.useNewID((newDbRecordID) => {
      const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, newDbRecordID);
      const dbRecord = isUnstructuredRecord(record)
        ? unstructuredValue(record as Unstructured<unknown>)
        : getDbFormatRecord(record);
      const kvsRecordValue = JSON.stringify(dbRecord);
      kvStore.setItem(kvsRecordID, kvsRecordValue);
    });
    return getRecord(dbRecordID) as DatabaseRecord;
  };

  const setRecord = (
    id: DbRecordID,
    newOrPartiallyNewRecord: Partial<DatabaseRecord>
  ): void => {
    const kvsRecordID = getKvsRecordIDFromDbRecordID(tableKey, id);
    const previousRecord = getRawRecord(id);
    if (previousRecord === undefined) throw `No record found for id - '${id}'`;
    const newRecord = isUnstructuredRecord(previousRecord)
      ? unstructuredValue(newOrPartiallyNewRecord as Unstructured<any>)
      : getDbFormatRecord({
          ...previousRecord,
          ...newOrPartiallyNewRecord,
        });

    const newKvsRecordValue: string = JSON.stringify(newRecord);
    kvStore.setItem(kvsRecordID, newKvsRecordValue);
  };

  const deleteRecord = (dbRecordID: DbRecordID): void => {
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
