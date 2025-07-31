import { signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { URL, getQueryParamValue, goToPage } from "../../../state/utils";
import { HTMLPage, NavScaffold } from "../../components";
import { TabBar } from "../../elements";
import { Budgets, TagsPage } from "./@components";

const MANAGE_MONEY_TABS = ["Budget", "Tags"] as const satisfies string[];
const selectedTabIndex = signal(0);
const header = trap(["Manage budget", "Manage tags and their categories"]).at(
  selectedTabIndex
);

const onPageMount = () => {
  const queryParamTabId = getQueryParamValue("tab") || "";
  selectedTabIndex.value = queryParamTabId === "" ? 0 : +queryParamTabId;
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
            0: () => Budgets({}),
            1: () => TagsPage({}),
          },
        }),
      ],
    }),
    navbarTop: TabBar({
      cssClasses: "nl3 nr3",
      tabs: MANAGE_MONEY_TABS,
      selectedTabIndex: selectedTabIndex,
      onTabChange: (tabIndex) => goToPage(URL.MANAGE, { tab: tabIndex }),
    }),
  }),
});
