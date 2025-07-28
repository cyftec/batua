import { signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "./@controller/localstorage/stores";
import { TxnUI } from "./@controller/models/core";
import { URL, goToPage, handleTap } from "./@controller/utils";
import { HTMLPage, NavScaffold, Tag } from "./@view/components";
import { Button, Icon } from "./@view/elements";
import { getPrimitiveRecordValue } from "./@controller/kvdb";

const allTxns = signal<TxnUI[]>([]);

const onPageMount = () => {
  allTxns.value = db.txns
    .getAll()
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: "Transactions",
    content: m.Div({
      children: m.For({
        subject: allTxns,
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
                        children: getPrimitiveRecordValue(txn.title),
                      }),
                      m.Div({
                        class: "flex flex-wrap",
                        children: m.For({
                          subject: txn.tags,
                          map: (tag) =>
                            Tag({
                              size: "xsmall",
                              state: "selected",
                              children: getPrimitiveRecordValue(tag),
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
