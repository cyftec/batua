import { PrimitiveExtendedRecord } from "../../../kvdb";

export type TxnTitle = string;

/**
 *
 *
 * UI Models
 */
export type TxnTitleUI = PrimitiveExtendedRecord<TxnTitle>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */
export const INITIAL_TXN_TITLES: TxnTitle[] = ["Record first account balance"];
