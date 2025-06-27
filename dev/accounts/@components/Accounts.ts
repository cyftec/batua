import { component, m } from "@mufw/maya";
import { AccountUI } from "../../@libs/common/models/core";
import { goToEditAccountPage } from "../../@libs/common/utils";
import { CardButton, Section } from "../../@libs/elements";
import { AccountCard } from "./AccountCard";

type AccountsProps = {
  marketAccounts: AccountUI[];
  myAccounts: AccountUI[];
};

export const Accounts = component<AccountsProps>(
  ({ marketAccounts, myAccounts }) => {
    return m.Div({
      children: [
        Section({
          title: "Market as an account",
          children: m.For({
            subject: marketAccounts,
            map: (acc) =>
              AccountCard({
                cssClasses: "mb3",
                account: acc,
              }),
          }),
        }),
        Section({
          title: "My accounts",
          children: m.For({
            subject: myAccounts,
            n: Infinity,
            nthChild: CardButton({
              onTap: () => goToEditAccountPage(),
              icon: "add_card",
              label: "Add new account",
            }),
            map: (acc) =>
              AccountCard({
                onTap: acc.isPermanent
                  ? undefined
                  : () => goToEditAccountPage(acc.id),
                cssClasses: "mb3",
                account: acc,
              }),
          }),
        }),
      ],
    });
  }
);
