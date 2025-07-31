export type DbUnsupportedType = "Date" | "Boolean";
export type IDKey = "id";
export const ID_KEY: IDKey = "id";
export type DbRecordID = number;
export type TableKey = string;
export type KvsRecordIDPrefix = `${TableKey}_`;
export type KvsRecordID = `${KvsRecordIDPrefix}${DbRecordID}`;

export type PrimitiveExtendedRecordValueKey = "value";
export const PLAIN_EXTENDED_RECORD_VALUE_KEY: PrimitiveExtendedRecordValueKey =
  "value";
// FIXME: The classification should be NonStructuredExtendedRecord and StructuredExtendedRecord
// instead of PrimitiveExtendedRecord and ObjectExtendedRecord
// Currently PrimitiveExtendedRecord only supports primitives and not array or objects
// but there's a valid case like in analytics or settings where even multiple unstructured
// objects are required to be stored in the db. Hence the suggestion.
export type PrimitiveExtendedRecord<Record> = Record extends object
  ? never
  : {
      [ID_KEY]: DbRecordID;
      [PLAIN_EXTENDED_RECORD_VALUE_KEY]: Record;
    };
export type ObjectExtendedRecord<Record> = Record extends object
  ? object & { [ID_KEY]: DbRecordID }
  : never;
export type Extend<RawRecord> = RawRecord extends object
  ? ObjectExtendedRecord<RawRecord>
  : PrimitiveExtendedRecord<RawRecord>;
