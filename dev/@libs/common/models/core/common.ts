import { ID, ID_KEY } from "../../localstorage/core";

export type NumBoolean = 0 | 1;

export const COMBINED_TYPE_SEPARATOR = "##" as const satisfies string;
export type CombinedTypeSeparator = typeof COMBINED_TYPE_SEPARATOR;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type WithID<T extends object> = { [ID_KEY]: ID } & T;

export type TypeData<
  RootType extends Record<string, string>,
  K extends keyof RootType
> = {
  key: K;
  label: RootType[K];
};

export const getTypeData = <
  RootType extends Record<string, string>,
  K extends keyof RootType
>(
  data: RootType,
  type: K
): TypeData<RootType, K> => {
  return {
    key: type,
    label: data[type],
  };
};
