import { phase } from "@mufw/maya/utils";
import { ID } from "../../models/core";

export const LSID = {
  getCurrentID: function (): number {
    let maxID = localStorage.getItem("maxID");
    if (!maxID) localStorage.setItem("maxID", "0");
    maxID = localStorage.getItem("maxID");
    return +(maxID as string) as number;
  },
  getNewID: function (): ID {
    return this.getCurrentID() + 1;
  },
  setMaxID: function (id: number): void {
    if (id <= this.getCurrentID()) return;
    localStorage.setItem("maxID", `${id}`);
  },
};

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
  if (!phase.currentIs("run")) return lsKeys;

  for (const key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    lsKeys.push(key);
  }

  return lsKeys;
};
