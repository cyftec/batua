import type {
  CurrencyCode,
  DbInitializationPhase,
} from "../../../@libs/common";
import type { Preferences } from "./types";
import { PREFS_KEYS } from "./contants";
import { phases } from "@maya/core";

const getStorageItem = <V extends string>(
  propName: string,
  defaultValue: V
) => ({
  get value(): V {
    if (phases.value.htmlBuildPhase) return "" as V;
    return (window.localStorage.getItem(propName) || defaultValue) as V;
  },
  set value(value: NonNullable<V>) {
    if (phases.value.htmlBuildPhase) return;
    window.localStorage.setItem(propName, value);
  },
});

export const PREFERENCES: Preferences = {
  localCurrency: getStorageItem<CurrencyCode>(PREFS_KEYS.localCurrency, "INR"),
  dbInitPhase: getStorageItem<DbInitializationPhase>(
    PREFS_KEYS.dbInitPhase,
    "pending"
  ),
};
