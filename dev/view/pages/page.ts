import { m } from "@mufw/maya";
import { unstructuredValue } from "../../_kvdb";
import { store } from "../../controllers/state";
import { URL, goToPage, handleTap } from "../../controllers/utils";
import { HTMLPage, NavScaffold, Tag } from "../components";
import { Button, Icon } from "../elements";

const onPageMount = () => {
  store.initialize();
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: "Transactions",
    content: m.Div({
      children: m.For({
        subject: store.txns.list,
        map: (txn) =>
          m.Div({
            class: "flex justify-between mb3",
            onclick: handleTap(() => goToPage(URL.EDIT.TXN, { id: txn.id })),
            children: [
              m.Div({
                class: "flex",
                children: [
                  m.Div({
                    class: "bg-near-white br3 pa2 mr2",
                    children: txn.payments
                      .reduce((s, p) => {
                        return p.account.type === "expense" ? s + p.amount : s;
                      }, 0)
                      .toLocaleString(),
                  }),
                  m.Div({
                    class: "",
                    children: [
                      m.Div({
                        class: "f6 mb1",
                        children: unstructuredValue(txn.title),
                      }),
                      m.Div({
                        class: "flex flex-wrap",
                        children: m.For({
                          subject: txn.tags,
                          map: (tag) =>
                            Tag({
                              size: "xsmall",
                              state: "selected",
                              children: unstructuredValue(tag),
                            }),
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              m.Div({
                class: "silver f8 w2 mt1",
                children: txn.date
                  .toDateString()
                  .split(" ")
                  .slice(0, -1)
                  .join(" "),
              }),
            ],
          }),
      }),
    }),
    navbarTop: m.Div({
      class: "w-100 flex justify-end",
      children: Button({
        onTap: () => goToPage(URL.EDIT.TXN),
        cssClasses: "flex items-center pa3 mb3",
        children: [
          Icon({ cssClasses: "mr1", iconName: "add" }),
          "Add new transaction",
        ],
      }),
    }),
  }),
});
