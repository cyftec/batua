import { component, m } from "@mufw/maya";
import { CapitalAccountUI } from "../../@libs/common/models/core";
import { Section } from "../../@libs/elements";
import { AccountCard } from "./AccountCard";

type CapitalAccountsProps = {
  capitalAccounts: CapitalAccountUI[];
};

export const CapitalAccounts = component<CapitalAccountsProps>(
  ({ capitalAccounts }) => {
    return Section({
      title: "Loan & Deposit accounts",
      children: m.For({
        subject: capitalAccounts,
        map: (acc) =>
          AccountCard({
            cssClasses: "mb3",
            account: acc,
          }),
      }),
    });
  }
);
