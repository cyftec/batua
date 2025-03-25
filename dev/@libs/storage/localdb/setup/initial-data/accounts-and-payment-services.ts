import type { AccountDB, PaymentServiceDB } from "../../../../common";

export const CASH_ACCOUNT_ID = crypto.randomUUID();
export const NOTES_COINS_PAYMENT_SERVICE_ID = crypto.randomUUID();

export const ACCOUNTS: AccountDB[] = [
  {
    id: CASH_ACCOUNT_ID,
    name: "Cash",
    type: "savings",
    uniqueId: undefined,
    balance: 982,
    currency: "INR",
  },
];

export const PAYMENT_SERVICES: PaymentServiceDB[] = [
  {
    id: NOTES_COINS_PAYMENT_SERVICE_ID,
    name: "Notes & Coins",
    uniqueId: undefined,
    accounts: [CASH_ACCOUNT_ID],
  },
];
