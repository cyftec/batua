import { ID } from "../../models/core";

export const getNewNumberID = (): ID => new Date().getTime();

export const parseObjectJsonString = <T extends Object>(
  objectJsonString: string | null | undefined,
  uniquePropKey: string,
  nonNullUniquePropValue?: any
): T | undefined => {
  const obj: T = JSON.parse(objectJsonString || "{}");
  const isObject = obj && typeof obj === "object";
  const uniquePropValue = obj[uniquePropKey];
  const matchesSignature = nonNullUniquePropValue
    ? uniquePropValue === nonNullUniquePropValue
    : uniquePropKey in obj;

  if (!isObject || !matchesSignature) return;
  return obj;
};

export const validLocalStorageKeys = () => {
  const lsKeys: string[] = [];
  for (const key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    lsKeys.push(key);
  }

  return lsKeys;
};
