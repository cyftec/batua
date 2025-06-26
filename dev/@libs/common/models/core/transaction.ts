import { ID, TypeData } from "./common";
import { PaymentUI } from "./payment";
import { TagUI } from "./tag";
import { TxnTitleUI } from "./transaction-title";

export const TRANSACTION_TYPE = {
  expense: "paid in full for a purchase",
  earning: "received as income, gift, profit or interest",
  unsettled: "lend, borrow or a group purchase",
  settlement: "paid or received in part or full for settlement",
  transfer: "transferred between my accounts",
  lost: "Financial or unaccounted loss, misplaced or stolen",
} as const;
export type TxnType = keyof typeof TRANSACTION_TYPE;

export type TxnNecessity = "Essential" | "Luxury" | "Mixed";

export type Txn = {
  date: number;
  modifiedAt: number;
  necessity: TxnNecessity;
  payments: PaymentUI["id"][];
  tags: TagUI["id"][];
  title: TxnTitleUI["id"];
  type: TxnType;
};

/**
 *
 *
 * UI Models
 */
export type TxnTypeUI<K extends TxnType> = TypeData<typeof TRANSACTION_TYPE, K>;

export type TxnUI = Omit<Txn, "payments" | "tags" | "title" | "type"> & {
  id: ID;
  payments: PaymentUI[];
  tags: TagUI[];
  title: TxnTitleUI;
  type: TxnTypeUI<TxnType>;
};
