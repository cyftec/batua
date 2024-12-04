import { component, m } from "@maya/core";
import { dstr } from "@maya/signal";
import { CURRENCIES, MOCK } from "../../@libs/common";
import { SectionTitle } from "../../@libs/ui-kit";
import { AddButtonTile } from "./add-button-tile";
import { ListTile } from "./list-tile";

type AccountsListProps = {
  classNames?: string;
};

export const AccountsList = component<AccountsListProps>(({ classNames }) =>
  m.Div({
    class: dstr`${classNames}`,
    children: [
      SectionTitle({
        classNames: "mt2 mb4",
        iconName: "account_balance",
        label: "Bank Accounts and Other Money Sources",
      }),
      m.Div({
        class: "flex flex-wrap",
        children: m.For({
          items: MOCK.ACCOUNTS,
          map: (account) =>
            ListTile({
              classNames: "h4 w-45",
              title: account.name,
              subtitle: `${account.accountId ? `${account.accountId} ` : ""}(${
                account.currency
              })`,
              child: m.Div({
                class: "mt3",
                children: [
                  m.Span({
                    children: m.Text`${() =>
                      CURRENCIES[account.currency].symbol}`,
                  }),
                  m.Span({
                    class: "ml1 f3",
                    children: m.Text`${() =>
                      account.balance.toLocaleString("en-IN")}`,
                  }),
                ],
              }),
            }),
        }),
      }),
      AddButtonTile({
        classNames: "pt4 h4 w-45",
        label: "Add new account",
        onClick: () => console.log("Add new payment method"),
      }),
    ],
  })
);
