import { effect, signal, value } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { TabBar } from "./TabBar";

type TabsProps = {
  tabNames: string[];
  initialSelectedTabIndex?: number;
  tabs: Child[];
};

export const Tabs = component<TabsProps>(
  ({ tabNames, initialSelectedTabIndex, tabs }) => {
    const selectedTabIndex = signal<number>(
      initialSelectedTabIndex?.value ?? 0
    );

    effect(() => console.log(tabs));

    return m.Div({
      children: [
        TabBar({
          cssClasses: "sticky bottom-0",
          tabs: tabNames,
          selectedTabIndex: selectedTabIndex,
          onTabChange: (tabIndex) => (selectedTabIndex.value = tabIndex),
        }),
        m.Switch({
          subject: selectedTabIndex,
          cases: value(tabs).reduce((casesMap, child, index) => {
            casesMap[index] = () => child;
            return casesMap;
          }, {} as { [x: string]: () => Child }),
        }),
      ],
    });
  }
);
