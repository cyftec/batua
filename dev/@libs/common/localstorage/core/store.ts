import { phase } from "@mufw/maya/utils";
import { ID } from "../../models/core";
import { getNewNumberID, validLocalStorageKeys } from "./misc";
import { parseNum } from "../../utils";

export type Store<Record, RecordUI> = {
  isEmpty: () => boolean;
  keyIsValid: (key: string) => boolean;
  getAllKeys: () => string[];
  getKey: (id: ID) => string;
  getAll: (ids?: ID[]) => RecordUI[];
  get: (id: ID) => RecordUI | undefined;
  add: (record: Record) => void;
  update: (record: RecordUI) => void;
  delete: (record: RecordUI) => void;
};

const getIDFromKey = (recordKeyPrefix: string, key: string) => {
  const recordIdStr = key.split(recordKeyPrefix)[1] || "";
  return parseNum(recordIdStr);
};

export const getStore = <Record, RecordUI extends { id: ID } & object>(
  recordKeyPrefix: string,
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
    for (const lsKey of validLocalStorageKeys()) {
      const thisStore = this as Store<Record, RecordUI>;
      if (thisStore.keyIsValid(lsKey)) validKeys.push(lsKey);
    }
    return validKeys;
  },
  getKey: function (id: ID) {
    return `${recordKeyPrefix}${id}`;
  },
  getAll: function (ids?: ID[]) {
    if (!phase.currentIs("run")) return [];
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
    const thisStore = this as Store<Record, RecordUI>;
    const key = thisStore.getKey(id);
    const recordString = localStorage.getItem(key);
    const record = lsValueToRecord(recordString);
    if (!record) return;
    const recordUI = recordToRecordUI(id, record);
    return recordUI;
  },
  add: function (record: Record) {
    const thisStore = this as Store<Record, RecordUI>;
    const recordKey = thisStore.getKey(getNewNumberID());
    const recordValue = recordToLsValue(record);
    localStorage.setItem(recordKey, recordValue);
  },
  update: function (recordUI: RecordUI) {
    const thisStore = this as Store<Record, RecordUI>;
    const recordKey = thisStore.getKey(recordUI.id);
    const record = recordUIToRecord(recordUI);
    const recordValue = recordToLsValue(record);
    localStorage.setItem(recordKey, recordValue);
  },
  delete: function (recordUI: RecordUI) {
    const thisStore = this as Store<Record, RecordUI>;
    const recordKey = thisStore.getKey(recordUI.id);
    localStorage.removeItem(recordKey);
  },
});
