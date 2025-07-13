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
        n: 0,
        nthChild: CardButton({
          onTap: () => goToEditAccountPage(),
          cssClasses: "w-100 mb3 mt1",
          icon: "account_balance",
          label: "Add new account",
        }),
        map: (acc) =>
          AccountCard({
            onTap: acc.isPermanent
              ? undefined
              : () => goToEditAccountPage(acc.id),
            cssClasses: "mb3 w-48",
            account: acc,
          }),
      }),
    });
  }
);
