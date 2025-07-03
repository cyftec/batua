import { component, m } from "@mufw/maya";
import { MarketAccountUI } from "../../@libs/common/models/core";
import { goToEditAccountPage } from "../../@libs/common/utils";
import { CardButton, Section } from "../../@libs/elements";
import { AccountCard } from "./AccountCard";

type MarketAccountsProps = {
  marketAccounts: MarketAccountUI[];
};

export const MarketAccounts = component<MarketAccountsProps>(
  ({ marketAccounts }) => {
    return Section({
      title: "Debt & Investment accounts",
      children: m.For({
        subject: marketAccounts,
        map: (acc) =>
          AccountCard({
            cssClasses: "mb3",
            account: acc,
          }),
      }),
    });
  }
);
