import { phase } from "@mufw/maya/utils";
import {
  DbUnsupportedType,
  Extended,
  getIDFromLSKey,
  getLSKeyFromID,
  ID,
  ID_KEY,
  LSID,
  PLAIN_RECORD_VALUE_KEY,
  TableKey,
  validLocalStorageKeys,
} from "./misc";

export type Table<RawRecord, ExtendedRecord extends Extended<RawRecord>> = {
  isEmpty: () => boolean;
  getAllIDs: () => ID[];
  getRaw: (id: ID) => RawRecord | undefined;
  get: (id: ID) => ExtendedRecord | undefined;
  getAll: (ids?: ID[]) => ExtendedRecord[];
  add: (record: RawRecord) => ID;
  update: (
    id: ID,
    newOrPartiallyNewRecord: RawRecord extends object
      ? Partial<RawRecord>
      : RawRecord
  ) => void;
  delete: (recordID: ID) => void;
};

export const createTable = <
  RawRecord,
  ExtendedRecord extends Extended<RawRecord>
>(
  tableKey: TableKey,
  foreignKeyMappings?: Partial<{ [k in keyof RawRecord]: Table<any, any> }>,
  dbToJsTypeMappings?: Partial<{ [k in keyof RawRecord]: DbUnsupportedType }>
): Table<RawRecord, ExtendedRecord> => ({
  isEmpty: function () {
    const thisStore = this as Table<RawRecord, ExtendedRecord>;
    const validKeys = thisStore.getAllIDs();
    return validKeys.length === 0;
  },
  getAllIDs: function () {
    const validIDs: ID[] = [];
    for (const lsKey of validLocalStorageKeys()) {
      const validTableRecordID = getIDFromLSKey(tableKey, lsKey);
      if (validTableRecordID === undefined) continue;
      validIDs.push(validTableRecordID);
    }
    return validIDs;
  },
  getRaw: function (id: ID) {
    if (!phase.currentIs("run")) return;
    const key = getLSKeyFromID(tableKey, id);
    const recordString = localStorage.getItem(key);
    if (recordString === null) return;
    const record = JSON.parse(recordString);
    return record as RawRecord;
  },
  get: function (id: ID) {
    if (!phase.currentIs("run")) return;
    const thisStore = this as Table<RawRecord, ExtendedRecord>;
    const record = thisStore.getRaw(id);

    if (!record) return;

    if (typeof record !== "object") {
      return {
        [ID_KEY]: id,
        [PLAIN_RECORD_VALUE_KEY]: record as RawRecord,
      } as unknown as ExtendedRecord;
    }

    if (foreignKeyMappings) {
      Object.entries(foreignKeyMappings).forEach(([key, foreignStore]) => {
        // rawPropValue can only be undefined | ID | ID[]
        const rawPropValue = record[key];

        if (typeof rawPropValue === "number") {
          record[key] = (foreignStore as Table<any, any>).get(
            rawPropValue as ID
          );
        }

        if (Array.isArray(rawPropValue)) {
          record[key] = (foreignStore as Table<any, any>).getAll(
            rawPropValue as ID[]
          );
        }
      });
    }

    if (dbToJsTypeMappings) {
      Object.entries(dbToJsTypeMappings).forEach(([key, jsType]) => {
        // rawPropValue can only be one of DbUnsupportedType
        const rawPropValue = record[key];
        if (typeof rawPropValue === "number" && jsType === "Date") {
          record[key] = new Date(rawPropValue);
        }
      });
    }

    return { id, ...record } as unknown as ExtendedRecord;
  },
  getAll: function (ids?: ID[]) {
    const thisStore = this as Table<RawRecord, ExtendedRecord>;
    const validIDs: ID[] = ids || thisStore.getAllIDs();
    const records: ExtendedRecord[] = [];
    for (const recordID of validIDs) {
      const record = thisStore.get(recordID);
      if (!record) continue;
      records.push(record);
    }
    return records;
  },
  add: function (record: RawRecord) {
    const recordID = LSID.getNewID();
    if (!phase.currentIs("run")) return recordID;
    const recordKey = getLSKeyFromID(tableKey, recordID);
    const recordValue = JSON.stringify(record);
    localStorage.setItem(recordKey, recordValue);
    LSID.setMaxID(recordID);
    return recordID;
  },
  update: function (
    id: ID,
    newOrPartiallyNewRecord: RawRecord extends object
      ? Partial<RawRecord>
      : RawRecord
  ) {
    if (!phase.currentIs("run")) return;
    const thisStore = this as Table<RawRecord, ExtendedRecord>;
    const recordKey = getLSKeyFromID(tableKey, id);
    const prevStateRecord = thisStore.getRaw(id);
    if (prevStateRecord === undefined) throw `No record found for id - '${id}'`;

    let newRecordValue: string;
    if (typeof prevStateRecord === "object") {
      newRecordValue = JSON.stringify({
        ...prevStateRecord,
        ...newOrPartiallyNewRecord,
      });
    } else {
      newRecordValue = JSON.stringify(newOrPartiallyNewRecord);
    }

    localStorage.setItem(recordKey, newRecordValue);
  },
  delete: function (recordID: ID) {
    if (!phase.currentIs("run")) return;
    const recordKey = getLSKeyFromID(tableKey, recordID);
    localStorage.removeItem(recordKey);
  },
});
