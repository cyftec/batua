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
  ACCOUNTS: { href: "/accounts/" },
  EDIT: {
    ACCOUNT: { href: "/edit/account/" },
    PAYMENT_METHOD: { href: "/edit/payment-method/" },
    TXN: { href: "/edit/transaction/" },
  },
  MANAGE: { href: "/manage/" },
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

export const goToEditXPage = (xHref: string, id?: ID) =>
  goToHref(xHref, id === undefined ? undefined : { id: `${id}` });
export const goToEditAccountPage = (accountId?: ID) =>
  goToEditXPage(APP.EDIT.ACCOUNT.href, accountId);
export const goToEditPaymentMethodPage = (paymentMethodId?: ID) =>
  goToEditXPage(APP.EDIT.PAYMENT_METHOD.href, paymentMethodId);
export const goToEditTxnPage = (txnId?: ID) =>
  goToEditXPage(APP.EDIT.TXN.href, txnId);
