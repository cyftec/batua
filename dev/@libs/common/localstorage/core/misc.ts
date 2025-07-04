import { phase } from "@mufw/maya/utils";
import { parseNum } from "../../utils";

export type DbUnsupportedType = "Date";
export type IDKey = "id";
export const ID_KEY: IDKey = "id";
export type ID = number;
export type TableKey = string;
export type RecordKeyPrefix = `${TableKey}_`;
export type LSRecordKey = `${RecordKeyPrefix}${ID}`;
export type PlainRecordValueKey = "value";
export const PLAIN_RECORD_VALUE_KEY: PlainRecordValueKey = "value";
export type PlainExtendedRecord<Record> = Record extends object
  ? never
  : {
      [ID_KEY]: ID;
      [PLAIN_RECORD_VALUE_KEY]: Record;
    };
export type ObjectExtendedRecord<Record> = Record extends object
  ? object & { [ID_KEY]: ID }
  : never;
export type Extended<RawRecord> = RawRecord extends object
  ? ObjectExtendedRecord<RawRecord>
  : PlainExtendedRecord<RawRecord>;

export const LSID = {
  getCurrentID: function (): number {
    let maxID = localStorage.getItem("maxID");
    if (!maxID) localStorage.setItem("maxID", "0");
    maxID = localStorage.getItem("maxID");
    return +(maxID as string) as number;
  },
  getNewID: function (): ID {
    return this.getCurrentID() + 1;
  },
  setMaxID: function (id: number): void {
    if (id <= this.getCurrentID()) return;
    localStorage.setItem("maxID", `${id}`);
  },
};

export const getRecordKeyPrefix = (tableKey: TableKey): RecordKeyPrefix =>
  `${tableKey}_`;

export const getIDFromLSKey = (
  tableKey: TableKey,
  lsKey: string
): ID | undefined => {
  const recordKeyPrefix = getRecordKeyPrefix(tableKey);
  if (!lsKey.startsWith(recordKeyPrefix)) return;

  const recordIdStr = lsKey.split(recordKeyPrefix)[1] || "";
  return parseNum(recordIdStr);
};

export const getLSKeyFromID = (tableKey: TableKey, id: ID): LSRecordKey => {
  const recordKeyPrefix = getRecordKeyPrefix(tableKey);
  return `${recordKeyPrefix}${id}`;
};

export const parseObjectJsonString = <T extends Object>(
  objectJsonString: string | null | undefined,
  nonNullPropKey: string
): T | undefined => {
  const obj = JSON.parse(objectJsonString || "{}");
  const isObject = obj && typeof obj === "object";
  if (!isObject) return;
  const propValue = obj[nonNullPropKey];
  if (propValue === null || propValue === undefined) {
    console.log(objectJsonString, nonNullPropKey);

    throw `The value for nonNullPropKey '${nonNullPropKey}' should not be null or undefined`;
  }

  return obj;
};

export const validLocalStorageKeys = () => {
  const lsKeys: string[] = [];
  if (!phase.currentIs("run")) return lsKeys;

  for (const key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    lsKeys.push(key);
  }

  return lsKeys;
};
