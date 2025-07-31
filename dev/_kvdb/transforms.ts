import {
  DbUnsupportedType,
  KvsRecordID,
  KvsRecordIDPrefix,
  TableKey,
  DbRecordID,
} from "./models";
import { Table } from "./table";

export const parseNum = (str: string) =>
  Number.isNaN(+str) ? undefined : +str;

export const getKvsRecordIDPrefix = (tableKey: TableKey): KvsRecordIDPrefix =>
  `${tableKey}_`;

export const getDbRecordIDFromKvsRecordID = (
  tableKey: TableKey,
  kvStoreRecordID: string
): DbRecordID | undefined => {
  const recordIDPrefix = getKvsRecordIDPrefix(tableKey);
  if (!kvStoreRecordID.startsWith(recordIDPrefix)) return;
  const recordIdStr = kvStoreRecordID.split(recordIDPrefix)[1] || "";
  return parseNum(recordIdStr);
};

export const getKvsRecordIDFromDbRecordID = (
  tableKey: TableKey,
  dbRecordID: DbRecordID
): KvsRecordID => {
  const recordIDPrefix = getKvsRecordIDPrefix(tableKey);
  return `${recordIDPrefix}${dbRecordID}`;
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
  rawValue?: DbRecordID | DbRecordID[]
) => {
  // rawValue can only be undefined | DbRecordID | DbRecordID[]
  if (typeof rawValue === "number") return table.get(rawValue as DbRecordID);
  if (Array.isArray(rawValue)) {
    return rawValue.length ? table.get(rawValue as DbRecordID[]) : rawValue;
  }
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
