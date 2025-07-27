import { phase } from "@mufw/maya/utils";

export type HrefObject = { href: string } & object;

export const getQueryParamValue = (queryParamKey: string) => {
  if (!phase.currentIs("run")) return "";
  const urlString = window.location.search;
  const urlParams = new URLSearchParams(urlString);
  return urlParams.get(queryParamKey) || undefined;
};

export const goToPage = (
  hrefObj: HrefObject,
  params?: Record<string, string | number | boolean | undefined | null>
) => {
  const { href } = hrefObj;
  if (!href) throw `Invalid navigation route.`;
  const paramsString =
    typeof params === "object"
      ? Object.keys(params)
          .reduce((pstr, key) => {
            if (!params[key]) return pstr;
            return `${pstr}${key}=${params[key]}&`;
          }, "?")
          .slice(0, -1)
      : "";
  location.href = `${href}${paramsString}`;
};

export const URL = {
  href: "/",
  ACCOUNTS: { href: "/accounts/" },
  EDIT: {
    ACCOUNT: { href: "/edit/account/" },
    BUDGET: { href: "/edit/budget/" },
    PAYMENT_METHOD: { href: "/edit/payment-method/" },
    TXN: { href: "/edit/transaction/" },
  },
  MANAGE: { href: "/manage/" },
  SETTINGS: {
    href: "/settings/",
    PRIVACY_POLICY: { href: "/settings/privacy-policy/" },
  },
};
