import {
  Children,
  Component,
  defaultMetaTags,
  m,
  valueIsArray,
} from "@maya/core";
import { Header, Navbar } from ".";
import { val } from "@maya/signal";

type PageProps = {
  title: string;
  headerTitle: string;
  scriptSrcPrefix?: string;
  selectedTabIndex?: number;
  content: Children;
};

export const Page: Component<PageProps> = ({
  title,
  headerTitle,
  scriptSrcPrefix,
  selectedTabIndex,
  content,
}) => {
  const childrenContent = valueIsArray(content) ? content : [content];
  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          ...defaultMetaTags(),
          m.Title({ children: title }),
          m.Link({
            rel: "stylesheet",
            href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
          }),
          m.Link({
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0",
          }),
          m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
        ],
      }),
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
                selectedLinkIndex: val(selectedTabIndex) ?? -1,
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
                    label: "Charts & trends",
                    href: "/charts.html",
                  },
                  {
                    index: 2,
                    icon: "savings",
                    label: "Budget & earnings",
                    href: "/budget.html",
                  },
                  {
                    index: 3,
                    icon: "sell",
                    label: "Tags & categories",
                    href: "/tags",
                  },
                  {
                    index: 4,
                    icon: "account_balance_wallet",
                    label: "Accounts & Payment Methods",
                    href: "/accounts-and-payments",
                  },
                ],
                rightLink: {
                  index: 5,
                  icon: "settings",
                  label: "Settings",
                  href: "/settings.html",
                },
              }),
              m.Div({
                class: "relative pl5 mw7",
                children: [Header({ title: headerTitle }), ...childrenContent],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
