import {
  Component,
  defaultMetaTags,
  m,
  MaybeArray,
  Node,
  valueIsArray,
} from "@maya/core";
import { Content, Header, Navbar } from ".";

type PageProps = {
  title: string;
  headerTitle: string;
  scriptPageName?: string;
  tabIndex: number;
  content: MaybeArray<Node>;
};

export const Page = ({
  title,
  headerTitle,
  scriptPageName,
  tabIndex,
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
          m.Link({ rel: "stylesheet", href: "assets/styles.css" }),
        ],
      }),
      m.Body({
        children: [
          m.Script({
            src: (scriptPageName ? `${scriptPageName}.` : "") + "main.js",
            defer: "true",
          }),
          m.Div({
            children: [
              Header({ title: headerTitle }),
              Content({
                children: childrenContent,
              }),
              Navbar({
                tabs: [
                  {
                    icon: "sort",
                    label: "Expenses",
                    href: "/",
                  },
                  {
                    icon: "insert_chart",
                    label: "Charts & trends",
                    href: "/charts.html",
                  },
                  {
                    icon: "savings",
                    label: "Budget & earnings",
                    href: "/budget.html",
                  },
                  {
                    icon: "sell",
                    label: "Tags & categories",
                    href: "/tags.html",
                  },
                  {
                    icon: "payments",
                    label: "Payment methods",
                    href: "/payment-methods.html",
                  },
                ],
                selectedTabIndex: tabIndex,
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
