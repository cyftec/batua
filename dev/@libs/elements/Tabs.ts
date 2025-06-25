import { signal } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { TabBar } from "./TabBar";

type TabsProps = {
  tabNames: string[];
  initialSelectedTabIndex?: number;
  children: Child[];
};

export const Tabs = component<TabsProps>(
  ({ tabNames, initialSelectedTabIndex, children }) => {
    const selectedTabIndex = signal<number>(
      initialSelectedTabIndex?.value ?? 0
    );

    return m.Div({
      children: [
        m.Switch({
          subject: selectedTabIndex,
          cases: children,
        }),
        TabBar({
          cssClasses: "sticky bottom-0",
          tabs: tabNames,
          selectedTabIndex: selectedTabIndex,
          onTabChange: (tabIndex) => (selectedTabIndex.value = tabIndex),
        }),
      ],
    });
  }
);
