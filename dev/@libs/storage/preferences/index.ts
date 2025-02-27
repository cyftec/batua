import { phase } from "@mufw/maya/utils";
import type {
  CurrencyCode,
  DbInitializationPhase,
} from "../../../@libs/common";
import { PREFS_KEYS } from "./contants";
import type { Preferences } from "./types";

const getStorageItem = <V extends string>(
  propName: string,
  defaultValue: V
) => ({
  get value(): V {
    if (phase.currentIs("build")) return "" as V;
    return (window.localStorage.getItem(propName) || defaultValue) as V;
  },
  set value(value: NonNullable<V>) {
    if (phase.currentIs("build")) return;
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
