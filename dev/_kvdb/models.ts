export type DbUnsupportedType = "Date" | "Boolean";
export type IDKey = "id";
export const ID_KEY: IDKey = "id";
export type DbRecordID = number;
export type TableKey = string;
export type KvsRecordIDPrefix = `${TableKey}_`;
export type KvsRecordID = `${KvsRecordIDPrefix}${DbRecordID}`;

export type UnstructuredExtendedRecordValueKey = "value";
export const UNSTRUCTURED_RECORD_VALUE_KEY: UnstructuredExtendedRecordValueKey =
  "value";
export type UnstructuredExtendedRecord<Record> = Record extends object
  ? never
  : WithID<{ [UNSTRUCTURED_RECORD_VALUE_KEY]: Record }>;
export type WithID<Record extends object> = { [ID_KEY]: DbRecordID } & Record;
export type StructuredExtendedRecord<Record> = Record extends object
  ? WithID<Record>
  : never;
export type Extend<RawRecord> = RawRecord extends object
  ? StructuredExtendedRecord<RawRecord>
  : UnstructuredExtendedRecord<RawRecord>;

// export type UnstructuredRecord<Record> = WithID<{
//   [UNSTRUCTURED_RECORD_VALUE_KEY]: Record;
// }>;
// export type StructuredRecord<Record extends object> = WithID<Record>;
// export type DbRecord<Raw> = Raw extends object
//   ? StructuredRecord<Raw> | UnstructuredRecord<Raw>
//   : UnstructuredRecord<Raw>;
