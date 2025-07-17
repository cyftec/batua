import { dispose, tmpl, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../common/utils";

type TabBarProps = {
  cssClasses?: string;
  tabs: string[];
  selectedTabIndex: number;
  onTabChange: (tabIndex: number) => void;
};

export const TabBar = component<TabBarProps>(
  ({ cssClasses, tabs, selectedTabIndex, onTabChange }) => {
    const containerClasses = tmpl`bg-white pa1 f7 ${cssClasses}`;
    const tabsData = trap(tabs).map((tab) => {
      const tabSelectionCss =
        tabs.value.indexOf(tab) === selectedTabIndex.value
          ? `bg-white b--light-silver b black`
          : "pointer b--transparent b--hover-black silver pointer";
      const tabClasses = `w-100 br3 pv2dot5 ph2 flex justify-center noselect br-pill ba bw1 ${tabSelectionCss}`;

      return {
        tabClasses,
        label: tab,
      };
    });

    return m.Div({
      onunmount: () => dispose(containerClasses, tabsData),
      class: containerClasses,
      children: m.Div({
        class: "bg-near-white br-pill flex items-center justify-between pa1",
        children: m.For({
          subject: tabsData,
          itemKey: "label",
          map: (tabObj, tabIndex) => {
            const { tabClasses, label } = trap(tabObj).props;
            return m.Span({
              onunmount: () => dispose(tabClasses, label),
              onclick: handleTap(() => onTabChange(tabIndex.value)),
              class: tabClasses,
              children: label,
            });
          },
        }),
      }),
    });
  }
);
