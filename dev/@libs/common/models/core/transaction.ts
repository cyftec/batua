import { TableRecordID } from "../../../kvdb";
import { PaymentUI } from "./payment";
import { TagUI } from "./tag";
import { TxnTitleUI } from "./transaction-title";

export type TxnType =
  | "balanceupdate"
  | "transfer"
  | "moneycredit"
  | "moneydebit"
  | "grouppurchase";
export const TXN_TYPES: Record<TxnType, string> = {
  balanceupdate: "Account balance update",
  transfer: "Money transfer",
  moneycredit: "Money earned",
  moneydebit: "Money spent",
  grouppurchase: "Group purchase",
};

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
