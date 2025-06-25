import { CombinedTypeSeparator, ID, TypeData } from "./common";
import { Payment, PaymentUI } from "./payment";
import { TagUI } from "./tag";

export const TRANSACTION_TYPE = {
  spent: "paid in full for a purchase",
  earned: "received as income, gift, profit or interest",
  borrowed: "borrowed, loaned or took credit from others",
  invested: "invested or lent money to others",
  unsettled: "paid or owed partly in a group purchase",
  settled: "paid or received unsettled money in part or full",
  transferred: "transferred between same account types",
  lost: "lost in investment, missing records or elsewhere",
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPE;

export type TransactionTitle = TransactionTitleUI["text"];

export type Transaction = {
  date: number;
  modifiedAt: number;
  necessity: "Essential" | "Luxury" | "Mixed";
  payments: PaymentUI["id"][];
  tags: TagUI["id"][];
  title: TransactionTitleUI["id"];
  type: TransactionType;
};

/**
 *
 *
 * UI Models
 */
export type TransactionTypeUI<K extends TransactionType> = TypeData<
  typeof TRANSACTION_TYPE,
  K
>;

export type TransactionTitleUI = {
  id: ID;
  text: string;
};

export type TransactionUI = Omit<
  Transaction,
  "payments" | "tags" | "title" | "type"
> & {
  id: ID;
  payments: PaymentUI[];
  tags: TagUI[];
  title: TransactionTitleUI;
  type: TransactionTypeUI<TransactionType>;
};
