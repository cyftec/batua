import { phase } from "@mufw/maya/utils";
import { INITIAL_ANALYTICS, StorageDetails } from "../../models";
import {
  db,
  fetchAnalytics,
  getStorageSpaceData,
  updateAnalytics,
} from "./stores";
import {
  CASH_EXPENSE_ACCOUNT,
  CASH_PAYMENT_METHOD,
  INITIAL_TAGS,
  NET_BANKING_PAYMENT_METHOD,
  MARKET,
} from "../../models/core";
import { ID_KEY } from "../../_kvdb";

/**
 *
 *
 *
 *    ANALYTICS
 */

export const getLastInteraction = () => {
  if (!phase.currentIs("run")) {
    return INITIAL_ANALYTICS.lastInteraction;
  }
  const currentAnalytics = fetchAnalytics();
  return currentAnalytics.lastInteraction;
};

export const updateInteractionTime = (date: Date) => {
  const currentAnalytics = fetchAnalytics();
  updateAnalytics({
    ...currentAnalytics,
    lastInteraction: date.getTime(),
  });
};

/**
 *
 *
 *
 *    SETTINGS
 */

export const getStorageData = (): StorageDetails => getStorageSpaceData();

/**
 *
 *
 *
 *    DATA
 */

export const isNewToApp = (): boolean => {
  const accountsStoreEmpty = db.accounts.length === 0;
  const pmethsStoreEmpty = db.paymentMethods.length === 0;

  const anyOneEmpty = accountsStoreEmpty || pmethsStoreEmpty;
  const allEmpty = accountsStoreEmpty && pmethsStoreEmpty;
  if (anyOneEmpty && !allEmpty)
    throw `Any one of the store is empty and/or corrupted`;

  return allEmpty;
};

export const populateInitialData = () => {
  INITIAL_TAGS.forEach((tag) => db.tags.push(tag));
  db.paymentMethods.push(NET_BANKING_PAYMENT_METHOD);
  const cashPm = db.paymentMethods.push(CASH_PAYMENT_METHOD);
  if (!cashPm) throw `Error getting CASH_PAYMENT_METHOD saving in DB`;
  const cashAcc = db.accounts.push(CASH_EXPENSE_ACCOUNT);
  db.accounts.push(MARKET);
  // Add Notes & Coins payment method to Cash account
  db.accounts.set(cashAcc[ID_KEY], {
    ...CASH_EXPENSE_ACCOUNT,
    paymentMethods: [cashPm],
  });
};
