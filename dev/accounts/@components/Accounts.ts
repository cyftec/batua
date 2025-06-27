import { Child, component, m } from "@mufw/maya";
import { Button, Icon, Section } from "../../@libs/elements";
import { goToEditAccountPage } from "../../@libs/common/utils";
import { AccountUI } from "../../@libs/common/models/core";
import { trap } from "@cyftech/signal";

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
          title: "World as an account",
          children: m.For({
            subject: marketAccounts,
            map: (acc) =>
              m.Div({
                class: "mb3",
                children: acc.name,
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
              m.Div({
                class: "mb3",
                children: acc.name,
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
