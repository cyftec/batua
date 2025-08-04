import { UnstructuredExtendedRecord } from "../../_kvdb";

export type TitleRaw = string;

/**
 *
 *
 * UI Models
 */
export type Title = UnstructuredExtendedRecord<TitleRaw>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */
export const INITIAL_TXN_TITLES: TitleRaw[] = ["Record first account balance"];
