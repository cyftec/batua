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
  const accountsStoreEmpty = db.accounts.isEmpty();
  const pmethsStoreEmpty = db.paymentMethods.isEmpty();

  const anyOneEmpty = accountsStoreEmpty || pmethsStoreEmpty;
  const allEmpty = accountsStoreEmpty && pmethsStoreEmpty;
  if (anyOneEmpty && !allEmpty)
    throw `Any one of the store is empty and/or corrupted`;

  return allEmpty;
};

export const populateInitialData = () => {
  INITIAL_TAGS.forEach((tag) => db.tags.add(tag));
  db.paymentMethods.add(NET_BANKING_PAYMENT_METHOD);
  const cashPmID = db.paymentMethods.add(CASH_PAYMENT_METHOD);
  const cashAccID = db.accounts.add(CASH_EXPENSE_ACCOUNT);
  db.accounts.add(MARKET);
  // Add Notes & Coins payment method to Cash account
  db.accounts.update(cashAccID, {
    ...CASH_EXPENSE_ACCOUNT,
    paymentMethods: [cashPmID],
  });
};
