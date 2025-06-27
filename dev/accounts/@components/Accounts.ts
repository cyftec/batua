import { Child, component, m } from "@mufw/maya";
import { Button, Icon, Section } from "../../@libs/elements";
import { goToEditAccountPage, handleTap } from "../../@libs/common/utils";
import { AccountUI } from "../../@libs/common/models/core";
import { trap } from "@cyftech/signal";
import { AccountCard } from "./AccountCard";

type AccountsProps = {
  marketAccounts: AccountUI[];
  myAccounts: AccountUI[];
  friendsAccounts: AccountUI[];
};

export const Accounts = component<AccountsProps>(
  ({ marketAccounts, myAccounts, friendsAccounts }) => {
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
            nthChild: Button({
              onTap: goToEditAccountPage,
              cssClasses: "pv2 ph3 flex items-center",
              children: [
                Icon({ cssClasses: "mr2", iconName: "add_card" }),
                "Add new account",
              ],
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
        Section({
          title: "Friends as unsettled accounts",
          children: m.Div(
            m.For({
              subject: friendsAccounts,
              n: Infinity,
              nthChild: Button({
                onTap: goToEditAccountPage,
                cssClasses: "pv2 ph3 flex items-center",
                children: [
                  Icon({ cssClasses: "mr2", iconName: "person_add" }),
                  "Add friend",
                ],
              }),
              map: (acc) =>
                m.Div({
                  class: "mb3",
                  children: acc.name,
                }),
            })
          ),
        }),
      ],
    });
  }
);
