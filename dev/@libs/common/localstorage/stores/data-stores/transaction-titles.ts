import { ID, TxnTitle, TxnTitleUI } from "../../../models/core";
import { createStore } from "../../core";

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

export const txnTitlesStore = createStore<TxnTitle, TxnTitleUI>(
  "tt_",
  lsValueToTxnTitle,
  txnTitleToLsValue,
  txnTitleToTxnTitleUI,
  txnTitleUiToTxnTitle
);
