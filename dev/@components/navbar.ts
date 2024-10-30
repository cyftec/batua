import { Component, drstr, m } from "@maya/core";

type TabData = {
  icon: string;
  label: string;
  href: string;
};

type NavbarProps = {
  tabs: TabData[];
  selectedTabIndex: number;
};

export const Navbar = Component<NavbarProps>(({ tabs, selectedTabIndex }) =>
  m.Div({
    class: "sticky left-0 right-0 bottom-0 bg-light-gray ph3",
    children: [
      m.Div({
        class: "flex items-center pb2",
        children: m.For({
          items: tabs,
          map: (tab, i) =>
            m.A({
              href: tab.href,
              class: drstr`no-underline f7 ph3 pt2 mr3 pointer ${() =>
                selectedTabIndex.value === i
                  ? "bg-white pb2 mb1 black"
                  : "pb2 gray"}`,
              children: m.Div({
                class: "flex flex-column items-center",
                children: [
                  m.Span({
                    class: "material-symbols-rounded",
                    style: "font-size: 28px",
                    children: m.Text(tab.icon),
                  }),
                  m.Div({
                    class: "f7 pt1",
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
