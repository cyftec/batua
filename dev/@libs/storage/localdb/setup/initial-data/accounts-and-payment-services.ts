import type { Account, PaymentMethod } from "../../../../common";

export const cashAccountName = "Cash";
export const notesAndCoinsPmName = "Notes & Coins";

export const ACCOUNTS: Account[] = [
  {
    name: cashAccountName,
    type: "savings",
    uniqueId: undefined,
    balance: 1000,
    currency: "INR",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: notesAndCoinsPmName,
    uniqueId: undefined,
    expiry: undefined,
  },
];
