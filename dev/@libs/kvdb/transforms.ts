import {
  KVSRecordID,
  KVSRecordIDPrefix,
  TableKey,
  TableRecordID,
} from "./models";

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
