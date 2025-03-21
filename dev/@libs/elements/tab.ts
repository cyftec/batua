import { Child, component, m } from "@mufw/maya";
import { derived, dstring, type Signal, val } from "@cyftech/signal";
import { Icon } from "./icon";

type TabProps = {
  classNames?: string;
  selectedTabClassNames?: string;
  tabs: string[];
  selectedTabIndex: number;
  onTabChange: (tabIndex: number) => void;
};

export const Tab = component<TabProps>(
  ({
    classNames,
    selectedTabClassNames,
    tabs,
    selectedTabIndex,
    onTabChange,
  }) => {
    return m.Div({
      class: dstring`w-100 bg-near-white br3 ${classNames}`,
      children: m.Div({
        class: "flex items-center justify-between pa1",
        children: m.For({
          subject: tabs,
          map: (tab, i) =>
            m.Span({
              class: dstring`w-100 br3 pa1 flex justify-center ${() =>
                i === selectedTabIndex.value
                  ? "bg-white black"
                  : "bg-transparent gray pointer"} ${selectedTabClassNames}`,
              onclick: () => onTabChange(i),
              children: tab,
            }),
        }),
      }),
    });
  }
);
