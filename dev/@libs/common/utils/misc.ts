import { updateInteractionTime } from "../localstorage";

const vibrateOnTap = () => {
  if (!!window.navigator?.vibrate) {
    window.navigator.vibrate(3);
  }
};

export const handleTap = (fn: ((...args: any[]) => any) | undefined) => {
  return (...args: any) => {
    vibrateOnTap();
    updateInteractionTime(new Date());
    return fn && fn(...args);
  };
};

export const parseNum = (str: string) =>
  Number.isNaN(+str) ? +str : undefined;
