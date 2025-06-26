import { ID, TxnTitle, TxnTitleUI } from "../../../models/core";
import { getStore } from "../../core";
import { PREFIX } from "./common";

const lsValueToTxnTitle = (
  lsValueString: string | null
): TxnTitle | undefined => {
  if (!lsValueString) return;
  return lsValueString;
};
const txnTitleToLsValue = (txnTitle: TxnTitle): string => txnTitle;
const txnTitleToTxnTitleUI = (id: ID, txnTitle: TxnTitle): TxnTitleUI => ({
  id,
  text: txnTitle,
});
const txnTitleUiToTxnTitle = (txnTitleUI: TxnTitleUI): TxnTitle =>
  txnTitleUI.text;

export const txnTitlesStore = getStore<TxnTitle, TxnTitleUI>(
  PREFIX.TRANSACTION_TITLE,
  lsValueToTxnTitle,
  txnTitleToLsValue,
  txnTitleToTxnTitleUI,
  txnTitleUiToTxnTitle
);
