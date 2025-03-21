export const DB_INIT_PHASES = {
  pending: "pending",
  done: "done",
} as const;

export const ACCOUNT_TYPE = {
  investment: "Investment Account (Stocks, Bonds, etc)",
  loan: "Loan Account (Loan or Credit)",
  savings: "Savings Account (Profits, Income, Piggybank or Savings)",
  people: "People Account (Lending, Borrwing or Unsettled Balance)",
} as const;

export const PAYMENT_TYPES = {
  debit: "Debited from",
  credit: "Credited to",
} as const;

export const TRANSACTION_TYPE = {
  spent: "paid in full for a purchase",
  earned: "received as income, gift, profit or interest",
  loaned: "borrowed, loaned or took credit from others",
  invested: "invested or lent money to others",
  unsettled: "paid or owed partly in a group purchase",
  settled: "paid or received unsettled money in part or full",
  transferred: "transferred between same account types",
  lost: "lost in investment, missing records or elsewhere",
} as const;
