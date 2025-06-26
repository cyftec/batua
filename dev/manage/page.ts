import { signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "../@libs/components";
import { TabBar } from "../@libs/elements";
import { Budget, Tags } from "./@components";

const MANAGE_MONEY_TABS = ["Budget", "Tags"] as const satisfies string[];
const selectedTabIndex = signal(0);

export default HTMLPage({
  body: NavScaffold({
    header: "Manage your money",
    content: m.Div({
      children: [
        m.Switch({
          subject: selectedTabIndex,
          cases: [Budget({}), Tags({})],
        }),
      ],
    }),
    navbarTop: TabBar({
      cssClasses: "mb2 nl2 nr2",
      tabs: MANAGE_MONEY_TABS,
      selectedTabIndex: selectedTabIndex,
      onTabChange: (tabIndex) => (selectedTabIndex.value = tabIndex),
    }),
  }),
});
