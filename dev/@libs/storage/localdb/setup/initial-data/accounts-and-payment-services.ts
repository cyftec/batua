import type { Account, PaymentMethod } from "../../../../common";

export const cashAccountId = crypto.randomUUID();
export const notesAndCoinsPmId = crypto.randomUUID();
export const bankTransferPmId = crypto.randomUUID();

export const ACCOUNTS: Account[] = [
  {
    id: cashAccountId,
    type: "savings",
    name: "Cash",
    uniqueId: undefined,
    balance: 1000,
    currency: "INR",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: notesAndCoinsPmId,
    name: "Notes & Coins",
    uniqueId: undefined,
    expiry: undefined,
  },
  {
    id: bankTransferPmId,
    name: "Bank Transfer",
    uniqueId: undefined,
    expiry: undefined,
  },
];
