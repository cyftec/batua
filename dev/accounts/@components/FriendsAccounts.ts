import { component, m } from "@mufw/maya";
import { AccountUI } from "../../@libs/common/models/core";
import { CardButton, Icon, Section } from "../../@libs/elements";

type FriendsAccountsProps = {
  accounts: AccountUI[];
};

export const FriendsAccounts = component<FriendsAccountsProps>(
  ({ accounts }) => {
    return m.Div({
      children: [
        Section({
          title: "Friends as unsettled accounts",
          children: m.Div(
            m.For({
              subject: accounts,
              n: Infinity,
              nthChild: CardButton({
                onTap: () => {},
                icon: "person_add",
                label: "Add friend",
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
