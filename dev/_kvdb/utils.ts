import {
  PLAIN_EXTENDED_RECORD_VALUE_KEY,
  PrimitiveExtendedRecord,
} from "./models";

export const primitiveValue = <T>(
  record: PrimitiveExtendedRecord<T extends object ? never : T>
) => record[PLAIN_EXTENDED_RECORD_VALUE_KEY];
