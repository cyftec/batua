import { ID_KEY } from "../../_kvdb";
import {
  CASH_EXPENSE_ACCOUNT,
  CASH_PAYMENT_METHOD,
  INITIAL_TAGS,
  MARKET,
  NET_BANKING_PAYMENT_METHOD,
} from "../../models/data-models";
import { db } from "./db";

/**
 *
 *
 *
 *    DATA
 */

export const isNewToApp = (): boolean => {
  const accountsStoreEmpty = db.accounts.count === 0;
  const pmethsStoreEmpty = db.paymentMethods.count === 0;

  const anyOneEmpty = accountsStoreEmpty || pmethsStoreEmpty;
  const allEmpty = accountsStoreEmpty && pmethsStoreEmpty;
  if (anyOneEmpty && !allEmpty)
    throw `Any one of the store is empty and/or corrupted`;

  return allEmpty;
};

export const populateInitialData = () => {
  INITIAL_TAGS.forEach((tag) => db.tags.put(tag));
  db.paymentMethods.put(NET_BANKING_PAYMENT_METHOD);
  const cashPm = db.paymentMethods.put(CASH_PAYMENT_METHOD);
  if (!cashPm) throw `Error getting CASH_PAYMENT_METHOD saving in DB`;
  const cashAcc = db.accounts.put(CASH_EXPENSE_ACCOUNT);
  db.accounts.put(MARKET);
  // Add Notes & Coins payment method to Cash account
  db.accounts.put({
    ...cashAcc,
    paymentMethods: [cashPm],
  });
};
