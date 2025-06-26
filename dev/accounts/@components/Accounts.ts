import { Child, component, m } from "@mufw/maya";
import { Button, Section } from "../../@libs/elements";
import { goToNewAccountPage } from "../../@libs/common/utils";
import { AccountUI } from "../../@libs/common/models/core";
import { trap } from "@cyftech/signal";

type AccountsProps = {
  accounts: AccountUI[];
};

export const Accounts = component<AccountsProps>(({ accounts }) => {
  const [myAccounts, othersAccounts] = trap(accounts).partition((acc) =>
    ["deposit", "loan"].includes(acc.type)
  );
  const [friendsAccounts, marketAccounts] = trap(othersAccounts).partition(
    (acc) => acc.type === "friend"
  );

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
          map: (acc) =>
            m.Div({
              class: "mb3",
              children: acc.name,
            }),
        }),
      }),
      Section({
        title: "Friends as unsettled accounts",
        children: m.If({
          subject: trap(friendsAccounts).length,
          isFalsy: "None",
          isTruthy: m.Div(
            m.For({
              subject: friendsAccounts,
              map: (acc) =>
                m.Div({
                  class: "mb3",
                  children: acc.name,
                }),
            })
          ),
        }),
      }),
      Button({
        onTap: goToNewAccountPage,
        cssClasses: "pv2 ph3",
        children: "Add new account",
      }),
    ],
  });
});
