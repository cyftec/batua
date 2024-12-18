import type {
  CurrencyCode,
  DbInitializationPhase,
} from "../../../@libs/common";

type PrefsItemGetValue<T> = T;
type PrefsItemSetValue<T> = NonNullable<T>;

export type PrefsItem<T extends string> = {
  get value(): PrefsItemGetValue<T>;
  set value(value: PrefsItemSetValue<T>);
};

export type Preferences = {
  localCurrency: PrefsItem<CurrencyCode>;
  dbInitPhase: PrefsItem<DbInitializationPhase>;
};
