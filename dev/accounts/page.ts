import { effect, op, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "../@libs/common/localstorage/stores";
import {
  CapitalAccountUI,
  ExpenseAccountUI,
  PaymentMethodUI,
  PeopleOrShopAccountUI,
} from "../@libs/common/models/core";
import { getQueryParamValue, goToAccountsPage } from "../@libs/common/utils";
import { HTMLPage, NavScaffold } from "../@libs/components";
import { TabBar } from "../@libs/elements";
import {
  CapitalAccounts,
  ExpenseAccounts,
  PaymentMethods,
  PeopleOrShopAccounts,
} from "./@components";

const ACCOUNTS_PAGE_TABS = [
  "Expense Accs",
  "Capital Accs",
  "Shops or People",
] as const satisfies string[];
const selectedTabIndex = signal(1);
const header = op(selectedTabIndex).ternary(
  "My other accounts",
  "My expense accounts & payment methods"
);
const allPaymentMethods = signal<PaymentMethodUI[]>([]);
const allExpenseAccounts = signal<ExpenseAccountUI[]>([]);
const allCapitalAccounts = signal<CapitalAccountUI[]>([]);
const allPeopleOrShopAccounts = signal<PeopleOrShopAccountUI[]>([]);

const triggerPageDataRefresh = () => {
  const queryParamTabId = getQueryParamValue("tab") || "";
  selectedTabIndex.value = queryParamTabId === "" ? 0 : +queryParamTabId;
  allPaymentMethods.value = db.paymentMethods.getAll();
  allExpenseAccounts.value = db.accounts.expenseAccounts.getAll();
  allCapitalAccounts.value = db.accounts.capitalAccounts.getAll();
  allPeopleOrShopAccounts.value = db.accounts.peopleOrShopAccounts.getAll();
};

const onPageMount = () => {
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
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
            1: () => CapitalAccounts({ capitalAccounts: allCapitalAccounts }),
            2: () =>
              PeopleOrShopAccounts({
                peopleOrShopAccounts: allPeopleOrShopAccounts,
              }),
          },
        }),
      ],
    }),
    navbarTop: TabBar({
      cssClasses: "mb1 nl2 nr2 f7",
      tabs: ACCOUNTS_PAGE_TABS,
      selectedTabIndex: selectedTabIndex,
      onTabChange: (tabIndex) => goToAccountsPage(tabIndex),
    }),
  }),
});
