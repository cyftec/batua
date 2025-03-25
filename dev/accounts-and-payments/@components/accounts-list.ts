import { dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { AccountUI, capitalise, CURRENCIES } from "../../@libs/common";
import { AddButtonTile, ListTile, SectionTitle } from "../../@libs/components";
import { Icon } from "../../@libs/elements";
import { allAccounts } from "../../@libs/stores/accounts";
import { AccountEditor } from "./account-editor";

type AccountsListProps = {
  classNames?: string;
  onAccountEdit: (account?: AccountUI) => void;
};

export const AccountsList = component<AccountsListProps>(
  ({ classNames, onAccountEdit }) => {
    return m.Div({
      class: dstring`${classNames}`,
      children: [
        SectionTitle({
          iconName: "account_balance",
          label: "Spending and Investment Accounts",
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: allAccounts,
            n: 1000,
            nthChild: AddButtonTile({
              classNames: "mr3 mt3 pv4 w-43",
              tooltip: "Add new account",
              onClick: onAccountEdit,
              children: Icon({
                className: "mb2 silver",
                size: 42,
                iconName: "add",
              }),
            }),
            map: (account) =>
              ListTile({
                classNames: "mr3 mt3 w-43",
                title: `${account.name} (${capitalise(account.type)})`,
                subtitle: `(${account.currency.code}) ${
                  account.uniqueId ? `${account.uniqueId} ` : ""
                }`,
                onClick: () => onAccountEdit(account),
                child: m.Div({
                  class: "mt3",
                  children: [
                    m.Span(
                      `${
                        CURRENCIES.find((c) => c.code === account.currency.code)
                          ?.symbol
                      }`
                    ),
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
  }
);
