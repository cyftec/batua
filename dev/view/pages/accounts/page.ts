import { effect, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  Account,
  DEPOSIT_ACCOUNT_TYPE,
  DepositAccount,
  EXPENSE_ACCOUNT_TYPE,
  ExpenseAccount,
  LOAN_ACCOUNT_TYPE,
  LoanAccount,
  PEOPLE_ACCOUNT_TYPE,
  PaymentMethod,
  PeopleAccount,
  SHOP_ACCOUNT_TYPE,
  ShopAccount,
} from "../../../models/core";
import { db } from "../../../state/localstorage/stores";
import { URL, getQueryParamValue, goToPage } from "../../../state/utils";
import { HTMLPage, NavScaffold } from "../../components";
import { TabBar } from "../../elements";
import {
  EntityAccounts,
  ExpenseAccounts,
  FundAccounts,
  PaymentMethods,
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
    if (acc.type === EXPENSE_ACCOUNT_TYPE) expAccs.push(acc as ExpenseAccount);
    if (acc.type === LOAN_ACCOUNT_TYPE) laonAccs.push(acc as LoanAccount);
    if (acc.type === DEPOSIT_ACCOUNT_TYPE) depAccs.push(acc as DepositAccount);
    if (acc.type === SHOP_ACCOUNT_TYPE) shopAccs.push(acc as ShopAccount);
    if (acc.type === PEOPLE_ACCOUNT_TYPE) peopAccs.push(acc as PeopleAccount);
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
    .get()
    .sort((a, b) => +b.isPermanent - +a.isPermanent);
  allAccounts.value = db.accounts.get();
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
