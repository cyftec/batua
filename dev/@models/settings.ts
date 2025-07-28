export const AS_SETTINGS_KEY = "settings" as const;
export const AS_SETTINGS_ID_KEY = "id" as const;
export const AS_SETTINGS_ID_VALUE = "app-settings" as const;

export type AppSettings = {
  id: typeof AS_SETTINGS_ID_VALUE;
};

export type StorageDetails = {
  total: number;
  spaceLeft: number;
};

export const INITIAL_SETTINGS: AppSettings = {
  id: "app-settings",
};

export const INITIAL_STORAGE_DATA: StorageDetails = {
  total: 0,
  spaceLeft: 100,
};
