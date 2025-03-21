import { Child, type Children, component, m } from "@mufw/maya";
import { Header, Navbar } from ".";
import { populateDbWithInitialData } from "../storage/localdb/setup/initiliaze-db";
import { STORAGE } from "../storage";

type HtmlPageProps = {
  htmlTitle: string;
  headElements?: Child[];
  headerTitle: string;
  selectedTabIndex?: number;
  mainContent: Children;
  sideContent: Children;
  onDocumentMount?: () => void;
};

export const HtmlPage = component<HtmlPageProps>(
  ({
    htmlTitle,
    headElements,
    headerTitle,
    selectedTabIndex,
    mainContent,
    sideContent,
    onDocumentMount,
  }) => {
    const initDb = async () => {
      if (STORAGE.prefs.dbInitPhase.value === "pending") {
        await populateDbWithInitialData();
        STORAGE.prefs.dbInitPhase.value = "done";
      }
    };

    return m.Html({
      onmount: initDb,
      lang: "en",
      children: [
        m.Head([
          m.Meta({
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          }),
          m.Title(htmlTitle),
          m.Link({
            rel: "icon",
            type: "image/x-icon",
            href: "/assets/images/favicon.ico",
          }),
          m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
          ...(headElements || []),
        ]),
        m.Body({
          class: "mid-gray",
          onmount: onDocumentMount,
          children: [
            m.Script({ src: "main.js", defer: "true" }),
            m.Div({
              class: "flex items-start",
              children: [
                Navbar({
                  classNames: "fg3",
                  selectedLinkIndex: selectedTabIndex?.value ?? -1,
                  links: [
                    {
                      index: 0,
                      icon: "swap_horiz",
                      label: "Transactions",
                      href: "/transactions",
                    },
                    {
                      index: 1,
                      icon: "bar_chart_4_bars",
                      label: "Charts & Trends",
                      href: "/charts",
                    },
                    {
                      index: 2,
                      icon: "savings",
                      label: "Budget & Investments",
                      href: "/budget",
                    },
                    {
                      index: 3,
                      icon: "sell",
                      label: "Tags & Categories",
                      href: "/tags",
                    },
                    {
                      index: 4,
                      icon: "account_balance_wallet",
                      label: "Accounts & Payment Services",
                      href: "/accounts-and-payments",
                    },
                  ],
                  rightLink: {
                    index: 5,
                    icon: "settings",
                    label: "Settings",
                    href: "/settings",
                  },
                }),
                m.Div({
                  class: "fg11",
                  children: [
                    Header({
                      classNames: "ml4 pt45 z-999",
                      title: headerTitle,
                    }),
                    m.Div({
                      class: "flex pt3",
                      children: [
                        m.Div({ class: "mh4 fg7", children: mainContent }),
                        m.Div({
                          class: "dn db-ns dn-m bg-near-white fg4",
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
  }
);
