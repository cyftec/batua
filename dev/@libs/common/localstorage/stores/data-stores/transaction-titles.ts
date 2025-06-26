import { ID, TransactionTitle, TransactionTitleUI } from "../../../models/core";
import { getStore } from "../../core";
import { PREFIX } from "./common";

const lsValueToTxnTitle = (
  lsValueString: string | null
): TransactionTitle | undefined => {
  if (!lsValueString) return;
  return lsValueString;
};
const txnTitleToLsValue = (txnTitle: TransactionTitle): string => txnTitle;
const txnTitleToTxnTitleUI = (
  id: ID,
  txnTitle: TransactionTitle
): TransactionTitleUI => ({ id, text: txnTitle });
const txnTitleUiToTxnTitle = (
  txnTitleUI: TransactionTitleUI
): TransactionTitle => txnTitleUI.text;

export const txnTitlesStore = getStore<TransactionTitle, TransactionTitleUI>(
  PREFIX.TRANSACTION_TITLE,
  lsValueToTxnTitle,
  txnTitleToLsValue,
  txnTitleToTxnTitleUI,
  txnTitleUiToTxnTitle
);
