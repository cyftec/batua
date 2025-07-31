import { component, m } from "@mufw/maya";
import { ExpenseAccount } from "../../../../models/core";
import { CardButton, Section } from "../../../elements";
import { URL, goToPage } from "../../../../state/utils";
import { AccountCard } from "./AccountCard";

type ExpenseAccountsProps = {
  expenseAccounts: ExpenseAccount[];
};

export const ExpenseAccounts = component<ExpenseAccountsProps>(
  ({ expenseAccounts }) => {
    return Section({
      contentCssClasses: "flex flex-wrap justify-between",
      title: "Expense accounts",
      children: m.For({
        subject: expenseAccounts,
        n: 0,
        nthChild: CardButton({
          onTap: () => goToPage(URL.EDIT.ACCOUNT, { type: "expense" }),
          cssClasses: "w-48 mb3",
          icon: "add",
          label: "Add new account",
        }),
        map: (acc) =>
          AccountCard({
            onTap: acc.isPermanent
              ? undefined
              : () =>
                  goToPage(URL.EDIT.ACCOUNT, { id: acc.id, type: "expense" }),
            cssClasses: "w-48 mb3",
            account: acc,
          }),
      }),
    });
  }
);
