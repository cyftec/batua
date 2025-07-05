export type DbUnsupportedType = "Date";
export type IDKey = "id";
export const ID_KEY: IDKey = "id";
export type TableRecordID = number;
export type TableID = string;
export type KVSRecordIDPrefix = `${TableID}_`;
export type KVSRecordID = `${KVSRecordIDPrefix}${TableRecordID}`;

export const parseNum = (str: string) =>
  Number.isNaN(+str) ? undefined : +str;

export const getKVSRecordIDPrefix = (tableID: TableID): KVSRecordIDPrefix =>
  `${tableID}_`;

export const getTableRecordIDFromKVSRecordID = (
  tableID: TableID,
  kvStoreRecordID: string
): TableRecordID | undefined => {
  const recordIDPrefix = getKVSRecordIDPrefix(tableID);
  if (!kvStoreRecordID.startsWith(recordIDPrefix)) return;
  const recordIdStr = kvStoreRecordID.split(recordIDPrefix)[1] || "";
  return parseNum(recordIdStr);
};

export const getKVSRecordIDFromTableRecordID = (
  tableID: TableID,
  id: TableRecordID
): KVSRecordID => {
  const recordIDPrefix = getKVSRecordIDPrefix(tableID);
  return `${recordIDPrefix}${id}`;
};
