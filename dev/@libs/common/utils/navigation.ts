import { phase } from "@mufw/maya/utils";

export const getQueryParamValue = (queryParamKey: string) => {
  if (!phase.currentIs("run")) return "";
  const urlString = window.location.search;
  const urlParams = new URLSearchParams(urlString);
  return urlParams.get(queryParamKey) || "";
};

export const goToHref = (href: string) => (location.href = href);

const APP = {
  href: "/",
  MANAGE: {
    href: "/manage/",
  },
  ACCOUNTS: {
    href: "/accounts/",
    NEW: {
      ACCOUNT: {
        href: "/accounts/new/account/",
      },
      PAYMENT_METHOD: {
        href: "/accounts/new/payment-method/",
      },
    },
  },
  SETTINGS: {
    href: "/settings/",
    PRIVACY_POLICY: { href: "/settings/privacy-policy/" },
  },
};
export const goToHomePage = () => goToHref(APP.href);
export const goToNewAccountPage = () => goToHref(APP.ACCOUNTS.NEW.ACCOUNT.href);
export const goToNewPaymentMethodPage = () =>
  goToHref(APP.ACCOUNTS.NEW.PAYMENT_METHOD.href);
