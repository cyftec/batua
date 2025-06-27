import { DerivedSignal, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "../@libs/components";
import { TabBar } from "../@libs/elements";
import { Accounts, PaymentMethods } from "./@components";
import { AccountUI, PaymentMethodUI } from "../@libs/common/models/core";
import {
  accountsStore,
  paymentMethodsStore,
} from "../@libs/common/localstorage/stores";

const ACCOUNTS_PAGE_TABS = [
  "Payment Methods",
  "Accounts",
] as const satisfies string[];
const selectedTabIndex = signal(0);
const header = trap(ACCOUNTS_PAGE_TABS).at(selectedTabIndex);
const accounts = signal<AccountUI[]>([]);
const paymentMethods = signal<PaymentMethodUI[]>([]);

const triggerPageDataRefresh = () => {
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
            0: PaymentMethods({ paymentMethods }),
            1: Accounts({ accounts }),
          },
        }),
      ],
    }),
    navbarTop: TabBar({
      cssClasses: "mb2 nl2 nr2",
      tabs: ACCOUNTS_PAGE_TABS,
      selectedTabIndex: selectedTabIndex,
      onTabChange: (tabIndex) => (selectedTabIndex.value = tabIndex),
    }),
  }),
});
