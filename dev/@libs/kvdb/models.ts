export type DbUnsupportedType = "Date";
export type IDKey = "id";
export const ID_KEY: IDKey = "id";
export type TableRecordID = number;
export type TableID = string;
export type KVSRecordIDPrefix = `${TableID}_`;
export type KVSRecordID = `${KVSRecordIDPrefix}${TableRecordID}`;

export type PrimitiveExtendedRecordValueKey = "value";
export const PLAIN_EXTENDED_RECORD_VALUE_KEY: PrimitiveExtendedRecordValueKey =
  "value";
export type PrimitiveExtendedRecord<Record> = Record extends object
  ? never
  : {
      [ID_KEY]: TableRecordID;
      [PLAIN_EXTENDED_RECORD_VALUE_KEY]: Record;
    };
export type ObjectExtendedRecord<Record> = Record extends object
  ? object & { [ID_KEY]: TableRecordID }
  : never;
export type Extend<RawRecord> = RawRecord extends object
  ? ObjectExtendedRecord<RawRecord>
  : PrimitiveExtendedRecord<RawRecord>;

export type KVStore = {
  getAllKeys: () => string[];
  getItem: (key: string) => string | undefined;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};
