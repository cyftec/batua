import { newUnstructuredRecord, Unstructured } from "@cyftec/kvdb";

/**
 *
 *
 * UI Models
 */
export type Title = Unstructured<string>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */
export const INITIAL_TXN_TITLES: Title[] = [
  newUnstructuredRecord("Set initial balance"),
];
