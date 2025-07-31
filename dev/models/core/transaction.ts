import { IDKey, DbRecordID } from "../../_kvdb";
import { Payment } from "./payment";
import { Tag } from "./tag";
import { Title } from "./title";

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

export type TxnRaw = {
  date: number;
  created: number;
  modified: number;
  type: TxnType;
  payments: Payment[IDKey][];
  tags: Tag[IDKey][];
  title: Title[IDKey];
};

/**
 *
 *
 * UI Models
 */

export type Txn = Omit<
  TxnRaw,
  "date" | "created" | "modified" | "payments" | "tags" | "title"
> & {
  id: DbRecordID;
  date: Date;
  created: Date;
  modified: Date;
  payments: Payment[];
  tags: Tag[];
  title: Title;
};
