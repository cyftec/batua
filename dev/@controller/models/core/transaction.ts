import { TableRecordID } from "../../kvdb";
import { PaymentUI } from "./payment";
import { TagUI } from "./tag";
import { TxnTitleUI } from "./transaction-title";

export type TxnType = "expense" | "earning" | "transfer" | "balance update";
export const TXN_TYPE_SUBTYPE_MAP = {
  expense: ["purchase", "unsettled purchase", "other"],
  earning: ["salary", "sale", "interest", "find", "other"],
  transfer: ["restructure", "settlement", "lend", "borrow", "other"],
  "balance update": [
    "initial balance",
    "interest",
    "no trace",
    "waive-off",
    "other",
  ],
} as const satisfies Record<TxnType, string[]>;
export type TxnSubType = (typeof TXN_TYPE_SUBTYPE_MAP)[TxnType][number];

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
