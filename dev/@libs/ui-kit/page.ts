import { defaultMetaTags, m, MaybeArray, Node, valueIsArray } from "@maya/core";
import { Content, Header, Navbar } from ".";

type PageProps = {
  title: string;
  headerTitle: string;
  scriptSrcPrefix?: string;
  selectedTabIndex?: number;
  content: MaybeArray<Node>;
};

export const Page = ({
  title,
  headerTitle,
  scriptSrcPrefix,
  selectedTabIndex = -1,
  content,
}: PageProps) => {
  const childrenContent = valueIsArray(content) ? content : [content];
  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          ...defaultMetaTags(),
          m.Title({ children: m.Text(title) }),
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
            children: [
              Header({ title: headerTitle }),
              Content({
                children: childrenContent,
              }),
              Navbar({
                selectedLinkIndex: selectedTabIndex,
                links: [
                  {
                    index: 0,
                    icon: "sort",
                    label: "Transactions",
                    href: "/transactions",
                  },
                  {
                    index: 1,
                    icon: "insert_chart",
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
                    href: "/tags.html",
                  },
                  {
                    index: 4,
                    icon: "payments",
                    label: "Payment methods",
                    href: "/payment-methods.html",
                  },
                ],
                rightLink: {
                  index: 5,
                  icon: "settings",
                  label: "Settings",
                  href: "/settings.html",
                },
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
