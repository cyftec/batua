import { getLastInteraction } from "../localstorage";
import { NavbarLink } from "../../models";
import { getMinutesInMS } from "./date-time";

export const isLastInteractionLongBack = () => {
  const now = new Date().getTime();
  const lastIntrxn = getLastInteraction();
  return now - lastIntrxn > getMinutesInMS(1);
};

export const getNavbarRoutes = (urlPath: string): NavbarLink[] => {
  return [
    {
      label: "Trnsxns",
      icon: "swap_vert",
      isSelected: urlPath === "/",
      href: "/",
    },
    {
      label: "Overview",
      icon: "equalizer",
      isSelected: urlPath.startsWith("/charts/"),
      href: "/charts/",
    },
    {
      label: "Manage",
      icon: "savings",
      isSelected: urlPath.startsWith("/manage/"),
      href: "/manage/",
    },
    {
      label: "Accounts",
      icon: "credit_card_gear",
      isSelected: urlPath.startsWith("/accounts/"),
      href: "/accounts/",
    },
    {
      label: "Settings",
      icon: "settings",
      isSelected: urlPath.startsWith("/settings/"),
      href: "/settings/",
    },
  ];
};
