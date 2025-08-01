import { ID_KEY, DbRecordID } from "../../_kvdb";

export type NumBoolean = 0 | 1;

export const COMBINED_TYPE_SEPARATOR = "##" as const satisfies string;
export type CombinedTypeSeparator = typeof COMBINED_TYPE_SEPARATOR;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
