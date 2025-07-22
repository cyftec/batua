import { component, m } from "@mufw/maya";
import {
  ExpenseAccountUI,
  PaymentMethodUI,
} from "../../@libs/common/models/core";
import { goToEditAccountPage } from "../../@libs/common/utils";
import { CardButton, Section } from "../../@libs/elements";
import { AccountCard } from "./AccountCard";
import { trap } from "@cyftech/signal";

type ExpenseAccountsProps = {
  expenseAccounts: ExpenseAccountUI[];
};

export const ExpenseAccounts = component<ExpenseAccountsProps>(
  ({ expenseAccounts }) => {
    return Section({
      contentCssClasses: "flex flex-wrap justify-between",
      title: "Expense accounts",
      children: m.For({
        subject: expenseAccounts,
        n: Infinity,
        nthChild: CardButton({
          onTap: () => goToEditAccountPage(undefined, "Expense"),
          cssClasses: "w-48 mb3",
          icon: "add",
          label: "Add new account",
        }),
        map: (acc) =>
          AccountCard({
            onTap: acc.isPermanent
              ? undefined
              : () => goToEditAccountPage(acc.id, "Expense"),
            cssClasses: "w-48 mb3",
            account: acc,
          }),
      }),
    });
  }
);
