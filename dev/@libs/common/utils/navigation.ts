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
    ACCOUNTS: {
      href: "/manage/accounts/",
      NEW: { href: "/manage/accounts/new" },
    },
  },
  SETTINGS: {
    href: "/settings/",
    PRIVACY_POLICY: { href: "/settings/privacy-policy/" },
  },
};
export const goToHomePage = () => goToHref(APP.href);
export const goToAccountCreatePage = () =>
  goToHref(APP.MANAGE.ACCOUNTS.NEW.href);
