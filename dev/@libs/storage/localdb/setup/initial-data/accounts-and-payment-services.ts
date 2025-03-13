import type { AccountDB, PaymentMethod } from "../../../../common";

export const CASH_ACCOUNT_ID = crypto.randomUUID();
export const NOTES_COINS_PAYMENT_METHOD_ID = crypto.randomUUID();

export const ACCOUNTS: AccountDB[] = [
  {
    id: CASH_ACCOUNT_ID,
    name: "Cash",
    type: "savings",
    uniqueId: undefined,
    balance: 1000,
    currency: "INR",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: NOTES_COINS_PAYMENT_METHOD_ID,
    name: "Notes & Coins",
    uniqueId: undefined,
    expiry: undefined,
  },
];
