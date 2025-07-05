import { phase } from "@mufw/maya/utils";
import { updateInteractionTime } from "../localstorage";

const vibrateOnTap = () => {
  if (!!window.navigator?.vibrate) {
    window.navigator.vibrate(5);
  }
};

export const handleTap = (fn: ((...args: any[]) => any) | undefined) => {
  return (...args: any) => {
    if (fn) vibrateOnTap();
    updateInteractionTime(new Date());
    return fn && fn(...args);
  };
};

export const parseObjectJsonString = <T extends Object>(
  objectJsonString: string | null | undefined,
  nonNullPropKey: string
): T | undefined => {
  const obj = JSON.parse(objectJsonString || "{}");
  const isObject = obj && typeof obj === "object";
  if (!isObject) return;
  const propValue = obj[nonNullPropKey];
  if (propValue === null || propValue === undefined) {
    console.log(objectJsonString, nonNullPropKey);

    throw `The value for nonNullPropKey '${nonNullPropKey}' should not be null or undefined`;
  }

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
