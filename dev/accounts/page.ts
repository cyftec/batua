import { derive, DerivedSignal, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "../@libs/components";
import { TabBar } from "../@libs/elements";
import { Accounts, PaymentMethods } from "./@components";
import { AccountUI, PaymentMethodUI } from "../@libs/common/models/core";
import {
  accountsStore,
  paymentMethodsStore,
} from "../@libs/common/localstorage/stores";
import { getQueryParamValue, goToAccountsPage } from "../@libs/common/utils";

const ACCOUNTS_PAGE_TABS = [
  "Accounts",
  "Payment Methods",
] as const satisfies string[];
const selectedTabIndex = signal(0);
const header = trap(ACCOUNTS_PAGE_TABS).at(selectedTabIndex);
const paymentMethods = signal<PaymentMethodUI[]>([]);
const accounts = signal<AccountUI[]>([]);
const marketAccounts = derive(() =>
  accounts.value.filter((acc) => ["market"].includes(acc.type))
);
const myAccounts = derive(() => {
  return accounts.value
    .filter((acc) => ["positive", "negative"].includes(acc.type))
    .sort((a, b) => b.isPermanent - a.isPermanent);
});
const friendsAccounts = derive(() =>
  accounts.value.filter((acc) => ["friend"].includes(acc.type))
);
const [_, othersAccounts] = trap(accounts).partition((acc) =>
  ["positive", "negative"].includes(acc.type)
);
const [__, ___] = trap(othersAccounts).partition(
  (acc) => acc.type === "friend"
);

const triggerPageDataRefresh = () => {
  selectedTabIndex.value = +getQueryParamValue("tab");
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
            0: Accounts({
              marketAccounts,
              myAccounts,
              friendsAccounts,
            }),
            1: PaymentMethods({ paymentMethods }),
          },
        }),
      ],
    }),
    navbarTop: TabBar({
      cssClasses: "mb2 nl2 nr2",
      tabs: ACCOUNTS_PAGE_TABS,
      selectedTabIndex: selectedTabIndex,
      onTabChange: (tabIndex) => goToAccountsPage(tabIndex),
    }),
  }),
});
