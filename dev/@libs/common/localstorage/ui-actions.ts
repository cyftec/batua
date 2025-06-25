import { phase } from "@mufw/maya/utils";
import { INITIAL_ANALYTICS, StorageDetails } from "../models";
import {
  fetchAnalytics,
  updateAnalytics,
  getStorageSpaceData,
  usersStore,
  accountsStore,
  txnsStore,
  paymentMethodsStore,
  paymentModesStore,
} from "./stores";
import { getInitialUsers } from "../utils";

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
  const usersStoreEmpty = usersStore.isEmpty();
  const accountsStoreEmpty = accountsStore.isEmpty();
  const pmethsStoreEmpty = paymentMethodsStore.isEmpty();
  const pmodes = paymentModesStore.isEmpty();
  const txnsStoreEmpty = txnsStore.isEmpty();

  const anyOneEmpty =
    usersStoreEmpty ||
    accountsStoreEmpty ||
    pmethsStoreEmpty ||
    pmodes ||
    txnsStoreEmpty;
  const allEmpty =
    usersStoreEmpty &&
    accountsStoreEmpty &&
    pmethsStoreEmpty &&
    pmodes &&
    txnsStoreEmpty;

  if (anyOneEmpty && !allEmpty)
    throw `Any one of the store is empty and/or corrupted`;

  return allEmpty;
};

export const populateInitialData = (
  selfUserName: string,
  selfUserEmail: string
) => {
  if (!selfUserName) throw `Name should not be empty`;
  const users = getInitialUsers(selfUserName, selfUserEmail);
  users.forEach((user) => {
    usersStore.add(user);
  });
};
