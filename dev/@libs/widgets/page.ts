import {
  type Children,
  type Component,
  defaultMetaTags,
  m,
  phases,
} from "@maya/core";
import { val } from "@maya/signal";
import { Header, Navbar } from ".";
import { pathname } from "../common";
import { initializeDb } from "../storage/localdb/setup/initiliaze-db";
import { STORAGE } from "../storage";

type PageProps = {
  title: string;
  headerTitle: string;
  scriptSrcPrefix?: string;
  selectedTabIndex?: number;
  mainContent: Children;
  sideContent: Children;
};

export const Page: Component<PageProps> = ({
  title,
  headerTitle,
  scriptSrcPrefix,
  selectedTabIndex,
  mainContent,
  sideContent,
}) => {
  const initDb = async () => {
    if (STORAGE.prefs.dbInitPhase.value === "pending") {
      await initializeDb();
      STORAGE.prefs.dbInitPhase.value = "done";
    }
  };

  return m.Html({
    onmount: initDb,
    lang: "en",
    children: [
      m.Head([
        ...defaultMetaTags(),
        m.Title(title),
        m.Link({
          rel: "stylesheet",
          href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
        }),
        m.Link({
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0",
        }),
        m.Link({ rel: "stylesheet", href: pathname("/assets/styles.css") }),
      ]),
      m.Body({
        class: "mid-gray",
        children: [
          m.Script({
            src: (scriptSrcPrefix ? `${scriptSrcPrefix}` : "") + "main.js",
            defer: "true",
          }),
          m.Div({
            class: "flex items-start",
            children: [
              Navbar({
                classNames: "fg1",
                selectedLinkIndex: val(selectedTabIndex) ?? -1,
                links: [
                  {
                    index: 0,
                    icon: "swap_horiz",
                    label: "Transactions",
                    href: pathname("/transactions"),
                  },
                  {
                    index: 1,
                    icon: "bar_chart_4_bars",
                    label: "Charts & Trends",
                    href: pathname("/charts.html"),
                  },
                  {
                    index: 2,
                    icon: "savings",
                    label: "Budget & Investments",
                    href: pathname("/budget.html"),
                  },
                  {
                    index: 3,
                    icon: "sell",
                    label: "Tags & Categories",
                    href: pathname("/tags"),
                  },
                  {
                    index: 4,
                    icon: "account_balance_wallet",
                    label: "Accounts & Payment Methods",
                    href: pathname("/accounts-and-payments"),
                  },
                ],
                rightLink: {
                  index: 5,
                  icon: "settings",
                  label: "Settings",
                  href: pathname("/settings.html"),
                },
              }),
              m.Div({
                class: "relative pl5 fg4",
                children: [
                  Header({ title: headerTitle }),
                  m.Div({
                    class: "flex",
                    children: [
                      m.Div({ class: "fg3", children: mainContent }),
                      m.Div({
                        class: "dn db-ns dn-m bg-almost-white fg2",
                        children: sideContent,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
