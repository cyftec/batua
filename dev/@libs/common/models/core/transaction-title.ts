import { PlainExtendedRecord } from "../../localstorage/core";

export type TxnTitle = string;

/**
 *
 *
 * UI Models
 */
export type TxnTitleUI = PlainExtendedRecord<TxnTitle>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */
export const INITIAL_TXN_TITLES: TxnTitle[] = ["Record first account balance"];
