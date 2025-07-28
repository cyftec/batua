import {
  DbUnsupportedType,
  KVSRecordID,
  KVSRecordIDPrefix,
  TableKey,
  TableRecordID,
} from "./models";
import { Table } from "./table";

export const parseNum = (str: string) =>
  Number.isNaN(+str) ? undefined : +str;

export const getKVSRecordIDPrefix = (tableKey: TableKey): KVSRecordIDPrefix =>
  `${tableKey}_`;

export const getTableRecordIDFromKVSRecordID = (
  tableKey: TableKey,
  kvStoreRecordID: string
): TableRecordID | undefined => {
  const recordIDPrefix = getKVSRecordIDPrefix(tableKey);
  if (!kvStoreRecordID.startsWith(recordIDPrefix)) return;
  const recordIdStr = kvStoreRecordID.split(recordIDPrefix)[1] || "";
  return parseNum(recordIdStr);
};

export const getKVSRecordIDFromTableRecordID = (
  tableKey: TableKey,
  tableRecordID: TableRecordID
): KVSRecordID => {
  const recordIDPrefix = getKVSRecordIDPrefix(tableKey);
  return `${recordIDPrefix}${tableRecordID}`;
};

export const getJsValue = (
  rawValue: number | undefined,
  jsType: DbUnsupportedType
) => {
  // jsType can only be one of DbUnsupportedType
  if (typeof rawValue === "number" && jsType === "Date") {
    return new Date(rawValue);
  }
  if (typeof rawValue === "number" && jsType === "Boolean") {
    return !!rawValue;
  }
  return rawValue;
};

export const getExtendedValue = (
  table: Table<any, any>,
  rawValue?: TableRecordID | TableRecordID[]
) => {
  // rawValue can only be undefined | TableRecordID | TableRecordID[]
  if (typeof rawValue === "number") return table.get(rawValue as TableRecordID);
  if (Array.isArray(rawValue)) return table.getAll(rawValue as TableRecordID[]);
  return rawValue;
};

export const getMappedObject = (
  valueConverter: (value: any) => any,
  obj: object,
  pathArray: string[]
) => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (pathArray.length === 1) {
    const key = pathArray[0];
    return { ...obj, [key]: valueConverter(obj[key]) };
  }

  const firstKey = pathArray[0];
  return {
    ...obj,
    [firstKey]: getMappedObject(
      valueConverter,
      obj[firstKey] as object,
      pathArray.slice(1)
    ),
  };
};
