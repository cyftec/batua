import {
  UNSTRUCTURED_RECORD_VALUE_KEY,
  UnstructuredExtendedRecord,
} from "./models";

export const unstructuredValue = <T>(
  record: UnstructuredExtendedRecord<T extends object ? never : T>
) => record[UNSTRUCTURED_RECORD_VALUE_KEY];
