import { component, m } from "@mufw/maya";
import { FriendAccountUI } from "../../@libs/common/models/core";
import { CardButton, Icon, Section } from "../../@libs/elements";

type FriendsAccountsProps = {
  friendsAccounts: FriendAccountUI[];
};

export const FriendsAccounts = component<FriendsAccountsProps>(
  ({ friendsAccounts }) => {
    return Section({
      title: "Friends as unsettled accounts",
      children: m.Div(
        m.For({
          subject: friendsAccounts,
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
    });
  }
);
