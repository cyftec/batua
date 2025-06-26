import { phase } from "@mufw/maya/utils";
import { INITIAL_ANALYTICS, StorageDetails } from "../models";
import {
  fetchAnalytics,
  updateAnalytics,
  getStorageSpaceData,
  accountsStore,
  txnsStore,
  paymentMethodsStore,
} from "./stores";
import { Account, PaymentMethod } from "../models/core";
import { CASH_PAYMENT_METHOD, getCashAccount, MARKET_ACCOUNT } from "../utils";

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
  const accountsStoreEmpty = accountsStore.isEmpty();
  const pmethsStoreEmpty = paymentMethodsStore.isEmpty();
  const txnsStoreEmpty = txnsStore.isEmpty();

  const anyOneEmpty = accountsStoreEmpty || pmethsStoreEmpty || txnsStoreEmpty;
  const allEmpty = accountsStoreEmpty && pmethsStoreEmpty && txnsStoreEmpty;
  if (anyOneEmpty && !allEmpty)
    throw `Any one of the store is empty and/or corrupted`;

  return allEmpty;
};

export const populateInitialData = () => {
  const cashPaymetnMethodID = paymentMethodsStore.add(CASH_PAYMENT_METHOD);
  const cashAccount = getCashAccount(cashPaymetnMethodID);
  accountsStore.add(cashAccount);
  accountsStore.add(MARKET_ACCOUNT);
};
