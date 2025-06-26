import { phase } from "@mufw/maya/utils";
import { ID } from "../../models/core";
import { LSID, validLocalStorageKeys } from "./misc";
import { parseNum } from "../../utils";

export type Store<Record, RecordUI> = {
  isEmpty: () => boolean;
  keyIsValid: (key: string) => boolean;
  getAllKeys: () => string[];
  getKey: (id: ID) => string;
  getAll: (ids?: ID[]) => RecordUI[];
  get: (id: ID) => RecordUI | undefined;
  add: (record: Record) => ID;
  update: (record: RecordUI) => void;
  delete: (record: RecordUI) => void;
};

const getIDFromKey = (recordKeyPrefix: string, key: string) => {
  const recordIdStr = key.split(recordKeyPrefix)[1] || "";
  return parseNum(recordIdStr);
};

export const createStore = <Record, RecordUI extends { id: ID } & object>(
  recordKeyPrefix: `${string}_`,
  lsValueToRecord: (lsValueString: string | null) => Record | undefined,
  recordToLsValue: (record: Record) => string,
  recordToRecordUI: (id: ID, record: Record) => RecordUI,
  recordUIToRecord: (recordUI: RecordUI) => Record
): Store<Record, RecordUI> => ({
  isEmpty: function () {
    const thisStore = this as Store<Record, RecordUI>;
    const validKeys = thisStore.getAllKeys();
    return validKeys.length === 0;
  },
  keyIsValid: function (key: string) {
    return key.startsWith(recordKeyPrefix);
  },
  getAllKeys: function () {
    const validKeys: string[] = [];
    const thisStore = this as Store<Record, RecordUI>;
    for (const lsKey of validLocalStorageKeys()) {
      if (thisStore.keyIsValid(lsKey)) validKeys.push(lsKey);
    }
    return validKeys;
  },
  getKey: function (id: ID) {
    return `${recordKeyPrefix}${id}`;
  },
  getAll: function (ids?: ID[]) {
    const thisStore = this as Store<Record, RecordUI>;
    const validIDs: ID[] =
      ids ||
      thisStore.getAllKeys().map((key) => {
        const id = getIDFromKey(recordKeyPrefix, key) || 0;
        if (!id) throw `ID not found for key - '${key}'`;
        return id;
      });
    const records: RecordUI[] = [];
    for (const recordID of validIDs) {
      const record = thisStore.get(recordID);
      if (!record) continue;
      records.push(record);
    }
    return records;
  },
  get: function (id: ID) {
    if (!phase.currentIs("run")) return;
    const thisStore = this as Store<Record, RecordUI>;
    const key = thisStore.getKey(id);
    const recordString = localStorage.getItem(key);
    const record = lsValueToRecord(recordString);
    if (!record) return;
    const recordUI = recordToRecordUI(id, record);
    return recordUI;
  },
  add: function (record: Record) {
    console.log(`adding new record - ${JSON.stringify(record)}`);

    const recordID = LSID.getNewID();
    if (!phase.currentIs("run")) return recordID;
    const thisStore = this as Store<Record, RecordUI>;
    const recordKey = thisStore.getKey(recordID);
    const recordValue = recordToLsValue(record);
    localStorage.setItem(recordKey, recordValue);
    LSID.setMaxID(recordID);
    console.log(
      `Record - ${JSON.stringify(record)} added. New maxID is ${recordID}`
    );
    return recordID;
  },
  update: function (recordUI: RecordUI) {
    if (!phase.currentIs("run")) return;
    const thisStore = this as Store<Record, RecordUI>;
    const recordKey = thisStore.getKey(recordUI.id);
    const record = recordUIToRecord(recordUI);
    const recordValue = recordToLsValue(record);
    localStorage.setItem(recordKey, recordValue);
  },
  delete: function (recordUI: RecordUI) {
    if (!phase.currentIs("run")) return;
    const thisStore = this as Store<Record, RecordUI>;
    const recordKey = thisStore.getKey(recordUI.id);
    localStorage.removeItem(recordKey);
  },
});
