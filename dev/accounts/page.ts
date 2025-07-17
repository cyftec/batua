import { effect, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "../@libs/common/localstorage/stores";
import {
  AccountUI,
  CAPITAL_ACCOUNT_TYPES_LIST,
  CapitalAccountType,
  CapitalAccountUI,
  ExpenseAccountUI,
  PaymentMethodUI,
  PeopleOrShopAccountType,
  PeopleOrShopAccountUI,
  PERSON_OR_SHOP_ACCOUNT_TYPES_LIST,
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
const header = trap([
  "My expense accounts & payment methods",
  "My loan & investment accounts",
  "Shops & People as accounts",
]).at(selectedTabIndex);
const allPaymentMethods = signal<PaymentMethodUI[]>([]);
const allAccounts = signal<AccountUI[]>([]);
const allExpenseAccounts = signal<ExpenseAccountUI[]>([]);
const allCapitalAccounts = signal<CapitalAccountUI[]>([]);
const allPeopleOrShopAccounts = signal<PeopleOrShopAccountUI[]>([]);

effect(() => {
  const expAccs: ExpenseAccountUI[] = [];
  const capAccs: CapitalAccountUI[] = [];
  const pspAccs: PeopleOrShopAccountUI[] = [];
  allAccounts.value.forEach((acc) => {
    if (acc.type === "Expense") expAccs.push(acc);
    if (CAPITAL_ACCOUNT_TYPES_LIST.includes(acc.type as CapitalAccountType))
      capAccs.push(acc as CapitalAccountUI);
    if (
      PERSON_OR_SHOP_ACCOUNT_TYPES_LIST.includes(
        acc.type as PeopleOrShopAccountType
      )
    )
      pspAccs.push(acc as PeopleOrShopAccountUI);
  });
  allExpenseAccounts.value = expAccs;
  allCapitalAccounts.value = capAccs;
  allPeopleOrShopAccounts.value = pspAccs;
});

const onPageMount = () => {
  const queryParamTabId = getQueryParamValue("tab") || "";
  selectedTabIndex.value = queryParamTabId === "" ? 0 : +queryParamTabId;
  allPaymentMethods.value = db.paymentMethods
    .getAll()
    .sort((a, b) => b.isPermanent - a.isPermanent);
  allAccounts.value = db.accounts.getAll();
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
