import type { PaymentDB, TransactionDB } from "../../../../common";
import {
  CASH_ACCOUNT_ID,
  NOTES_COINS_PAYMENT_SERVICE_ID,
} from "./accounts-and-payment-services";
import { DUMMY_EXPENSE_TAG_ID, TEST_TAG_ID } from "./tags-and-categories";

const now = new Date();
const transactionId = crypto.randomUUID();
const paymentId = crypto.randomUUID();

export const TRANSACTIONS: TransactionDB[] = [
  {
    id: transactionId,
    date: now,
    createdAt: now,
    modifiedAt: now,
    type: "spent",
    title: "My first expense (You can delete this)",
    tags: [TEST_TAG_ID, DUMMY_EXPENSE_TAG_ID],
    payments: [paymentId],
  },
];

export const PAYMENTS: PaymentDB[] = [
  {
    id: paymentId,
    amount: -18,
    account: CASH_ACCOUNT_ID,
    paymentService: NOTES_COINS_PAYMENT_SERVICE_ID,
  },
];
