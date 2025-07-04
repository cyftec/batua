import { effect, op, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  accountsStore,
  paymentMethodsStore,
} from "../@libs/common/localstorage/stores";
import {
  AccountUI,
  ExpenseAccountUI,
  FriendAccountUI,
  MARKET_ACCOUNT_TYPES,
  MarketAccountType,
  MarketAccountUI,
  PaymentMethodUI,
  WorldAccountUI,
} from "../@libs/common/models/core";
import { getQueryParamValue, goToAccountsPage } from "../@libs/common/utils";
import { HTMLPage, NavScaffold } from "../@libs/components";
import { Section, TabBar } from "../@libs/elements";
import { ExpenseAccounts, MarketAccounts, PaymentMethods } from "./@components";
import { AccountCard } from "./@components/AccountCard";
import { FriendsAccounts } from "./@components/FriendsAccounts";

const ACCOUNTS_PAGE_TABS = [
  "Expense Accounts",
  "Other Accounts",
] as const satisfies string[];
const selectedTabIndex = signal(1);
const header = op(selectedTabIndex).ternary(
  "My other accounts",
  "My expense accounts & payment methods"
);
const accounts = signal<AccountUI[]>([]);
const worldAccounts = signal<WorldAccountUI[]>([]);
const marketAccounts = signal<MarketAccountUI[]>([]);
const friendsAccounts = signal<FriendAccountUI[]>([]);
const expenseAccounts = signal<ExpenseAccountUI[]>([]);
const paymentMethods = signal<PaymentMethodUI[]>([]);

effect(() => {
  const allWorldAccs: WorldAccountUI[] = [];
  const allMarketAccs: MarketAccountUI[] = [];
  const allFriendAccs: FriendAccountUI[] = [];
  const allExpenseAccs: ExpenseAccountUI[] = [];
  accounts.value.forEach((acc) => {
    if (MARKET_ACCOUNT_TYPES.includes(acc.type as MarketAccountType)) {
      allMarketAccs.push(acc as MarketAccountUI);
    } else if (acc.type === "Friend") {
      allFriendAccs.push(acc as FriendAccountUI);
    } else if (acc.type === "Expense") {
      allExpenseAccs.push(acc as ExpenseAccountUI);
    } else {
      allWorldAccs.push(acc as WorldAccountUI);
    }
  });
  worldAccounts.value = allWorldAccs;
  marketAccounts.value = allMarketAccs;
  friendsAccounts.value = allFriendAccs;
  expenseAccounts.value = allExpenseAccs;
});

const triggerPageDataRefresh = () => {
  const queryParamTabId = getQueryParamValue("tab") || "";
  selectedTabIndex.value = queryParamTabId === "" ? 0 : +queryParamTabId;
  accounts.value = accountsStore.getAll();
  paymentMethods.value = paymentMethodsStore
    .getAll()
    .sort((a, b) => b.isPermanent - a.isPermanent);
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
                ExpenseAccounts({ expenseAccounts, paymentMethods }),
                PaymentMethods({ paymentMethods }),
              ]),
            1: () =>
              m.Div([
                Section({
                  title: "World as an account",
                  children: m.For({
                    subject: worldAccounts,
                    map: (acc) =>
                      AccountCard({
                        cssClasses: "mb3",
                        account: acc,
                      }),
                  }),
                }),
                MarketAccounts({ marketAccounts }),
                FriendsAccounts({ friendsAccounts }),
              ]),
          },
        }),
      ],
    }),
    navbarTop: TabBar({
      cssClasses: "mb1 nl2 nr2",
      tabs: ACCOUNTS_PAGE_TABS,
      selectedTabIndex: selectedTabIndex,
      onTabChange: (tabIndex) => goToAccountsPage(tabIndex),
    }),
  }),
});
