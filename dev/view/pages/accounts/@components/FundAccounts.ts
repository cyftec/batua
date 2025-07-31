import { component, m } from "@mufw/maya";
import { DepositAccount, LoanAccount } from "../../../../models/core";
import { CardButton, Section } from "../../../elements";
import { goToPage, URL } from "../../../../state/utils";
import { AccountCard } from "./AccountCard";

type FundAccountsProps = {
  allLoanAccounts: LoanAccount[];
  allDepositAccounts: DepositAccount[];
};

export const FundAccounts = component<FundAccountsProps>(
  ({ allLoanAccounts, allDepositAccounts }) => {
    return m.Div([
      Section({
        title: "Loan accounts",
        children: m.For({
          subject: allLoanAccounts,
          n: Infinity,
          nthChild: CardButton({
            onTap: () => goToPage(URL.EDIT.ACCOUNT, { type: "loan" }),
            cssClasses: "w-100 mb3",
            icon: "thermometer_gain",
            label: "Add new loan account",
          }),
          map: (acc) =>
            AccountCard({
              cssClasses: "mb3",
              account: acc,
              onTap: () =>
                goToPage(URL.EDIT.ACCOUNT, { id: acc.id, type: "loan" }),
            }),
        }),
      }),
      Section({
        title: "Deposit or investment accounts",
        children: m.For({
          subject: allDepositAccounts,
          n: Infinity,
          nthChild: CardButton({
            onTap: () => goToPage(URL.EDIT.ACCOUNT, { type: "deposit" }),
            cssClasses: "w-100 mb3",
            icon: "thermometer_add",
            label: "Add new deposit account",
          }),
          map: (acc) =>
            AccountCard({
              cssClasses: "mb3",
              account: acc,
              onTap: () =>
                goToPage(URL.EDIT.ACCOUNT, { id: acc.id, type: "deposit" }),
            }),
        }),
      }),
    ]);
  }
);
