import { TableRecordID } from "../../../kvdb";
import { Prettify } from "./common";
import { PaymentUI } from "./payment";
import { TagUI } from "./tag";
import { TxnTitleUI } from "./transaction-title";

export type ToMarketTxnType = "spent" | "group spent" | "lost";
export type ToPeopleTxnType = "gifted" | "lent";
export type FromMarketTxnType = "earned" | "found";
export type FromPeopleTxnType = "received as gift" | "borrowed";
export type CapitalTxnType = "loaned" | "invested";
export type TransferTxnType = "settled" | "transferred";
export type TxnType = Prettify<
  | ToMarketTxnType
  | FromMarketTxnType
  | ToPeopleTxnType
  | FromPeopleTxnType
  | CapitalTxnType
  | TransferTxnType
>;

export type TxnNecessity = "Essential" | "Luxury" | "Mixed";
export const TXN_NECESSITIES: TxnNecessity[] = ["Essential", "Luxury", "Mixed"];
export const TXN_NECESSITIES_WITH_ICONS: {
  label: TxnNecessity;
  icon: string;
}[] = [
  { label: "Essential", icon: "skillet" },
  { label: "Mixed", icon: "sunny_snowing" },
  { label: "Luxury", icon: "diamond_shine" },
];

export type Txn = {
  type: TxnType;
  date: number;
  created: number;
  modified: number;
  necessity: TxnNecessity;
  payments: PaymentUI["id"][];
  tags: TagUI["id"][];
  title: TxnTitleUI["id"];
};

/**
 *
 *
 * UI Models
 */

export type TxnUI = Omit<
  Txn,
  "date" | "created" | "modified" | "payments" | "tags" | "title"
> & {
  id: TableRecordID;
  date: Date;
  created: Date;
  modified: Date;
  payments: PaymentUI[];
  tags: TagUI[];
  title: TxnTitleUI;
};
