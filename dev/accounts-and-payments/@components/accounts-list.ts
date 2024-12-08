import { Component, m } from "@maya/core";
import { dstr } from "@maya/signal";
import { CURRENCIES, MOCK } from "../../@libs/common";
import { SectionTitle, AddButtonTile, ListTile } from "../../@libs/widgets";

type AccountsListProps = {
  classNames?: string;
};

export const AccountsList: Component<AccountsListProps> = ({ classNames }) =>
  m.Div({
    class: dstr`${classNames}`,
    children: [
      SectionTitle({
        classNames: "mt2 mb4",
        iconName: "account_balance",
        label: "Bank Accounts and Other Money Sources",
      }),
      m.Div({
        class: "flex flex-wrap nl4",
        children: m.For({
          items: MOCK.ACCOUNTS,
          n: 1000,
          nthChild: () => {
            return AddButtonTile({
              classNames: "ba bw1 b--near-white ml4 mb4 pt4 h4 w-43",
              label: "Add new account",
              onClick: () => console.log("Add new account"),
            });
          },
          map: (account) =>
            ListTile({
              classNames: "ba bw1 b--near-white ml4 mb4 h4 w-43",
              title: account.name,
              subtitle: `${account.accountId ? `${account.accountId} ` : ""}(${
                account.currency
              })`,
              child: m.Div({
                class: "mt3",
                children: [
                  m.Span(`${CURRENCIES[account.currency].symbol}`),
                  m.Span({
                    class: "ml1 f3",
                    children: `${account.balance.toLocaleString("en-IN")}`,
                  }),
                ],
              }),
            }),
        }),
      }),
    ],
  });
