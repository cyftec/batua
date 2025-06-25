import { signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "../@libs/components";
import { TabBar } from "../@libs/elements";
import { Accounts, People } from "./@components";

const ACCOUNTS_PAGE_TABS = ["People", "Accounts"] as const satisfies string[];
const selectedTabIndex = signal(0);

export default HTMLPage({
  body: NavScaffold({
    header: "People & Accounts",
    content: m.Div({
      children: [
        m.Switch({
          subject: selectedTabIndex,
          cases: [People({}), Accounts({})],
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
