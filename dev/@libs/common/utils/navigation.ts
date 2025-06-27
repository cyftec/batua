import { phase } from "@mufw/maya/utils";
import { ID } from "../models/core";

export const getQueryParamValue = (queryParamKey: string) => {
  if (!phase.currentIs("run")) return "";
  const urlString = window.location.search;
  const urlParams = new URLSearchParams(urlString);
  return urlParams.get(queryParamKey) || "";
};

export const goToHref = (href: string, params?: Record<string, string>) => {
  const paramsString = params
    ? Object.keys(params)
        .reduce((pstr, key) => {
          return `${pstr}${key}=${params[key]}&`;
        }, "?")
        .slice(0, -1)
    : "";
  location.href = `${href}${paramsString}`;
};

const APP = {
  href: "/",
  MANAGE: {
    href: "/manage/",
  },
  ACCOUNTS: {
    href: "/accounts/",
    EDIT: {
      ACCOUNT: {
        href: "/accounts/edit/account/",
      },
      PAYMENT_METHOD: {
        href: "/accounts/edit/payment-method/",
      },
    },
  },
  SETTINGS: {
    href: "/settings/",
    PRIVACY_POLICY: { href: "/settings/privacy-policy/" },
  },
};
export const goToHomePage = () => goToHref(APP.href);
export const goToAccountsPage = (tabIndex?: number) =>
  goToHref(
    APP.ACCOUNTS.href,
    tabIndex === undefined ? undefined : { tab: `${tabIndex}` }
  );
export const goToEditAccountPage = (accountId?: ID) =>
  goToHref(
    APP.ACCOUNTS.EDIT.ACCOUNT.href,
    accountId === undefined ? undefined : { id: `${accountId}` }
  );
export const goToEditPaymentMethodPage = (paymentMethodId?: ID) =>
  goToHref(
    APP.ACCOUNTS.EDIT.PAYMENT_METHOD.href,
    paymentMethodId === undefined ? undefined : { id: `${paymentMethodId}` }
  );
