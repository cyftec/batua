import { ID } from "./common";

export type TxnTitle = TxnTitleUI["text"];

/**
 *
 *
 * UI Models
 */
export type TxnTitleUI = {
  id: ID;
  text: string;
};
