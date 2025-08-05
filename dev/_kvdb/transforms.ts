import {
  DbRecord,
  DbRecordID,
  DbUnsupportedType,
  KvsRecordID,
  KvsRecordIDPrefix,
  NumBoolean,
  TableKey,
  WithID,
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
  dbValue: number | undefined,
  jsType: DbUnsupportedType
) => {
  // dbValue can only be one of DbUnsupportedType
  if (typeof dbValue === "number" && jsType === "Date") {
    return new Date(dbValue);
  }
  if (typeof dbValue === "number" && jsType === "Boolean") {
    return !!dbValue;
  }
  return dbValue;
};

type ReturnType<In> = In extends Date
  ? number
  : In extends boolean
  ? NumBoolean
  : In;
export const getDbValue = <ForeignDbRecord extends Date | boolean | undefined>(
  jsValue: ForeignDbRecord
): ReturnType<ForeignDbRecord> => {
  if (jsValue instanceof Date) {
    return jsValue.getTime() as ReturnType<typeof jsValue>;
  }
  if (typeof jsValue === "boolean") {
    return +jsValue as ReturnType<typeof jsValue>;
  }
  return jsValue as ReturnType<typeof jsValue>;
};

export const getExtendedValue = (
  table: Table<DbRecord<any>>,
  rawValue?: DbRecordID | DbRecordID[]
) => {
  // rawValue can only be undefined | DbRecordID | DbRecordID[]
  if (typeof rawValue === "number") return table.get(rawValue as DbRecordID);
  if (Array.isArray(rawValue)) {
    return rawValue.length ? table.get(rawValue as DbRecordID[]) : rawValue;
  }
  return rawValue;
};

export const getForeignDbRecordIdValues = <ForeignDbRecord extends object>(
  extendedValue: WithID<ForeignDbRecord> | WithID<ForeignDbRecord>[] | undefined
) => {
  if (Array.isArray(extendedValue)) {
    return extendedValue.map((rec) => rec.id);
  }
  if (typeof extendedValue === "object" && extendedValue !== null)
    return extendedValue.id;
  return extendedValue;
};

export const getMappedObject = (
  valueConverter: (value: any) => any,
  obj: object,
  /**
   * If the converted type is nested deep within the record (object),
   * pass the path as ["nestedLevel1", "nestedLeve2"..."nestedLevelN"]
   * for the object
   * const obj = {
   *   ...,
   *   nestedLevel1: {
   *     ...,
   *     nestedLevel2: {
   *       nestedLevel3: valueWhichNeedsConversion,
   *     }
   *   }
   * }
   */
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
