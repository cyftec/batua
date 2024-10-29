import { Component, drstr, m } from "@maya/core";

type TabData = {
  icon: string;
  label: string;
  href: string;
};

type NavbarProps = {
  tabs: TabData[];
  selectedTabIndex: number;
  onTabSelect: (tabIndex: number) => void;
};

export const Navbar = Component<NavbarProps>(
  ({ tabs, selectedTabIndex, onTabSelect }) =>
    m.Div({
      class: "left-0 right-0 bottom-0 bg-light-gray ph3",
      style: "position: sticky;",
      children: [
        m.Div({
          class: "flex items-center pb3",
          children: m.For({
            items: tabs,
            map: (tab, i) =>
              m.Div({
                class: drstr`ph3 pt4 mr2 ${() =>
                  selectedTabIndex.value === i
                    ? "bg-white pb3 mb1 black"
                    : "pb3 gray"}`,
                onclick: () => onTabSelect(i),
                children: m.Div({
                  class: "flex items-center",
                  children: [
                    m.Span({
                      class: "material-symbols-rounded",
                      style: "font-size: 18px",
                      children: m.Text(tab.icon),
                    }),
                    m.A({
                      class: drstr`pl2 no-underline ${() =>
                        selectedTabIndex.value === i ? "black" : "gray"}`,
                      href: tab.href,
                      children: m.Text(tab.label),
                    }),
                  ],
                }),
              }),
          }),
        }),
      ],
    })
);
