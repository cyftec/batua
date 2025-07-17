import { TableRecordID } from "../../../kvdb";
import { Prettify } from "./common";
import { PaymentUI } from "./payment";
import { TagUI } from "./tag";
import { TxnTitleUI } from "./transaction-title";

export type IncomingTxnType =
  | "earned"
  | "found"
  | "received as gift"
  | "interest earned";
export type OutgoingTxnType = "spent" | "lost" | "gifted";
export type FutureOutgoingTxnType =
  | "loaned"
  | "interest charged"
  | "borrowed"
  | "borrowed in group expense";
export type ParkedMoneyTxnType = "invested" | "lent" | "lent in group expense";
export type UnsettledTxnType = FutureOutgoingTxnType | ParkedMoneyTxnType;
export type TransferTxnType = "settled" | "transferred";
export type TxnType = Prettify<
  OutgoingTxnType | IncomingTxnType | UnsettledTxnType | TransferTxnType
>;

export type TxnNecessity = "Essential" | "Mixed" | "Luxury";
export const TXN_NECESSITIES: TxnNecessity[] = ["Essential", "Mixed", "Luxury"];
export const TXN_NECESSITIES_WITH_ICONS: {
  label: TxnNecessity;
  icon: string;
}[] = [
  { label: "Essential", icon: "skillet" },
  { label: "Mixed", icon: "sunny_snowing" },
  { label: "Luxury", icon: "diamond_shine" },
];

export type Txn = {
  date: number;
  created: number;
  modified: number;
  type: TxnType;
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
