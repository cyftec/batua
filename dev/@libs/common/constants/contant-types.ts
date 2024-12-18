export const DB_INIT_PHASES = {
  pending: "pending",
  done: "done",
} as const;

export const ACCOUNT_TYPE = {
  investment: "Piggybank or Investment Account",
  loan: "Credit or Loan Account",
  savings: "Income, Profits or Savings Account",
  people: "People as Accounts for borrowing or lending",
} as const;

export const PAYMENT_TYPES = {
  debit: "Debited from",
  credit: "Credited to",
} as const;

export const TRANSACTION_TYPE = {
  purchase: "paid in full for purchase",
  earning: "received as income, gift, profit or interest",
  loss: "lost in investment, missing records or elsewhere",
  bowrrow: "borrowed, loaned or took credit from others",
  investment: "invested or lent money to others",
  unsettled: "paid or owe partly in a group purchase",
  settlement: "paid or received unsettled money in part or full",
  transfer: "transferred between same account types",
} as const;