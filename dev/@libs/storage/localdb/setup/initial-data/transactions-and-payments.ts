import type { Payment, Transaction } from "../../../../common";
import {
  cashAccountId,
  notesAndCoinsPmId,
} from "./accounts-and-payment-services";

const now = new Date();
const transactionId = crypto.randomUUID();
const paymentId = crypto.randomUUID();

export const TRANSACTIONS: Transaction[] = [
  {
    id: transactionId,
    date: now,
    createdAt: now,
    modifiedAt: now,
    type: "purchase",
    title: "My first expense (You can delete this)",
    tags: ["test", "dummyexpense"],
    payments: [paymentId],
  },
];

export const PAYMENTS: Payment[] = [
  {
    id: paymentId,
    transactionId: transactionId,
    amount: 10,
    currencyCode: "INR",
    account: cashAccountId,
    paymentMethod: notesAndCoinsPmId,
    type: "debit",
  },
];
