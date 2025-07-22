import { phase } from "@mufw/maya/utils";
import { TableRecordID } from "../../kvdb";
import { AccountType } from "../models/core";

export const getQueryParamValue = (queryParamKey: string) => {
  if (!phase.currentIs("run")) return "";
  const urlString = window.location.search;
  const urlParams = new URLSearchParams(urlString);
  return urlParams.get(queryParamKey) || undefined;
};

export const goToHref = (
  href: string,
  params?: Record<string, string | number | boolean | undefined | null>
) => {
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

export const goToManageMoneyPage = (tabIndex?: number) =>
  goToHref(APP.MANAGE.href, { tab: tabIndex });

export const goToAccountsPage = (tabIndex?: number) =>
  goToHref(APP.ACCOUNTS.href, { tab: tabIndex });

export const goToEditXPage = (
  xHref: string,
  id?: TableRecordID,
  type?: string
) => goToHref(xHref, { id, type });
export const goToEditAccountPage = (
  accId?: TableRecordID,
  accType?: AccountType
) => goToEditXPage(APP.EDIT.ACCOUNT.href, accId, accType);
export const goToEditPaymentMethodPage = (paymentMethodId?: TableRecordID) =>
  goToEditXPage(APP.EDIT.PAYMENT_METHOD.href, paymentMethodId);
export const goToEditTxnPage = (txnId?: TableRecordID) =>
  goToEditXPage(APP.EDIT.TXN.href, txnId);
