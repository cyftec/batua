import { effect, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "../../../state/localstorage/stores";
import {
  Account,
  ExpenseAccount,
  PaymentMethod,
  EXPENSE_ACCOUNT_TYPE,
  LoanAccount,
  DepositAccount,
  PeopleAccount,
  ShopAccount,
  LOAN_ACCOUNT_TYPE,
  DEPOSIT_ACCOUNT_TYPE,
  PEOPLE_ACCOUNT_TYPE,
  SHOP_ACCOUNT_TYPE,
} from "../../../models/core";
import { URL, getQueryParamValue, goToPage } from "../../../state/utils";
import { HTMLPage, NavScaffold } from "../../components";
import { TabBar } from "../../elements";
import {
  FundAccounts,
  ExpenseAccounts,
  PaymentMethods,
  EntityAccounts,
} from "./@components";

const ACCOUNTS_PAGE_TABS = [
  "Expense Acc",
  "Loan & Deposit",
  "People & Shop",
] as const satisfies string[];
const selectedTabIndex = signal(1);
const header = trap([
  "My expense accounts & their payment methods",
  "My loan and deposit accounts",
  "Shops and people",
]).at(selectedTabIndex);
const allPaymentMethods = signal<PaymentMethod[]>([]);
const allAccounts = signal<Account[]>([]);
const allExpenseAccounts = signal<ExpenseAccount[]>([]);
const allLoanAccounts = signal<LoanAccount[]>([]);
const allDepositAccounts = signal<DepositAccount[]>([]);
const allShopAccounts = signal<ShopAccount[]>([]);
const allPeopleAccounts = signal<PeopleAccount[]>([]);

effect(() => {
  const expAccs: ExpenseAccount[] = [];
  const laonAccs: LoanAccount[] = [];
  const depAccs: DepositAccount[] = [];
  const shopAccs: ShopAccount[] = [];
  const peopAccs: PeopleAccount[] = [];
  allAccounts.value.forEach((acc) => {
    if (acc.type === EXPENSE_ACCOUNT_TYPE) expAccs.push(acc);
    if (acc.type === LOAN_ACCOUNT_TYPE) laonAccs.push(acc);
    if (acc.type === DEPOSIT_ACCOUNT_TYPE) depAccs.push(acc);
    if (acc.type === SHOP_ACCOUNT_TYPE) shopAccs.push(acc);
    if (acc.type === PEOPLE_ACCOUNT_TYPE) peopAccs.push(acc);
  });
  allExpenseAccounts.value = expAccs;
  allLoanAccounts.value = laonAccs;
  allDepositAccounts.value = depAccs;
  allShopAccounts.value = shopAccs;
  allPeopleAccounts.value = peopAccs;
});

const onPageMount = () => {
  const queryParamTabId = getQueryParamValue("tab") || "";
  selectedTabIndex.value = queryParamTabId === "" ? 0 : +queryParamTabId;
  allPaymentMethods.value = db.paymentMethods
    .get([])
    .sort((a, b) => b.isPermanent - a.isPermanent);
  allAccounts.value = db.accounts.get([]);
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: header,
    content: m.Div({
      children: [
        m.Switch({
          subject: selectedTabIndex,
          cases: {
            0: () =>
              m.Div([
                ExpenseAccounts({ expenseAccounts: allExpenseAccounts }),
                PaymentMethods({ paymentMethods: allPaymentMethods }),
              ]),
            1: () =>
              FundAccounts({
                allLoanAccounts,
                allDepositAccounts,
              }),
            2: () =>
              EntityAccounts({
                allShopAccounts,
                allPeopleAccounts,
              }),
          },
        }),
      ],
    }),
    navbarTop: TabBar({
      cssClasses: "nl3 nr3",
      tabs: ACCOUNTS_PAGE_TABS,
      selectedTabIndex: selectedTabIndex,
      onTabChange: (tabIndex) => goToPage(URL.ACCOUNTS, { tab: tabIndex }),
    }),
  }),
});
