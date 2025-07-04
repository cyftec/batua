import { phase } from "@mufw/maya/utils";
import {
  AppSettings,
  AS_SETTINGS_ID_KEY,
  AS_SETTINGS_KEY,
  INITIAL_SETTINGS,
  INITIAL_STORAGE_DATA,
  StorageDetails,
} from "../../models";
import { parseObjectJsonString, validLocalStorageKeys } from "../core";

export const updateSettings = (settings: AppSettings) => {
  localStorage.setItem(AS_SETTINGS_KEY, JSON.stringify(settings));
};

export const fetchSettings = (): AppSettings => {
  if (!phase.currentIs("run")) return INITIAL_SETTINGS;

  const getSettingsFromStore = () => {
    const settingsString = localStorage.getItem(AS_SETTINGS_KEY);
    if (!settingsString) return;
    const settingsObject = parseObjectJsonString<AppSettings>(
      settingsString,
      AS_SETTINGS_ID_KEY
    );
    return settingsObject;
  };

  const settingsObject = getSettingsFromStore();
  if (!settingsObject) updateSettings(INITIAL_SETTINGS);
  const settings = getSettingsFromStore();
  if (!settings) throw `Error fetching settings`;
  addFutureUpgradesIfMissing(settings);

  return getSettingsFromStore() as AppSettings;
};

export const addFutureUpgradesIfMissing = (settings: AppSettings) => {
  // v1 upgrade
  // if (!settings.editPage) {
  //   updateSettings({
  //     ...settings,
  //     editPage: INITIAL_SETTINGS.editPage,
  //   });
  // }
};

export const getStorageSpaceData = (): StorageDetails => {
  const storageData: StorageDetails = INITIAL_STORAGE_DATA;
  if (!phase.currentIs("run")) return storageData;

  const BYTES_PER_KB = 1024;
  let totalBytes = 0;
  const getKbFromBytes = (bytes: number) => bytes / BYTES_PER_KB;
  for (const lsKey of validLocalStorageKeys()) {
    const singleRecordBytes = (localStorage[lsKey].length + lsKey.length) * 2;
    totalBytes += singleRecordBytes;
  }

  storageData.total = getKbFromBytes(totalBytes);
  storageData.spaceLeft =
    (100 * (5 * 1024 * 1024 - totalBytes)) / (5 * 1024 * 1024);

  return storageData;
};
