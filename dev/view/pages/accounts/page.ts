import { effect, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { store } from "../../../controllers/state";
import { URL, getQueryParamValue, goToPage } from "../../../controllers/utils";
import {
  DEPOSIT_ACCOUNT_TYPE,
  DepositAccount,
  EXPENSE_ACCOUNT_TYPE,
  ExpenseAccount,
  LOAN_ACCOUNT_TYPE,
  LoanAccount,
  PEOPLE_ACCOUNT_TYPE,
  PeopleAccount,
  SHOP_ACCOUNT_TYPE,
  ShopAccount,
} from "../../../models/data-models";
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
  store.accounts.list.value.forEach((acc) => {
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
  store.initialize();
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
                PaymentMethods({ paymentMethods: store.paymentMethods.list }),
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
