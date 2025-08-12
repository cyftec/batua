import { component, m } from "@mufw/maya";
import { unstructuredValue } from "../../../../_kvdb";
import { store } from "../../../../controllers/state";
import { goToPage, handleTap, URL } from "../../../../controllers/utils";
import { CardButton } from "../../../elements";

type BudgetProps = {};

export const Budgets = component<BudgetProps>(({}) => {
  const onMount = () => {
    store.initialize();
  };

  return m.Div({
    onmount: onMount,
    children: [
      m.Div({
        children: m.For({
          subject: store.budgets.list,
          map: (budget) =>
            m.Div({
              class: "ba bw1 br4 b--light-silver pa2 mb3",
              onclick: handleTap(() =>
                goToPage(URL.EDIT.BUDGET, { id: budget.id })
              ),
              children: [
                m.Div({
                  class: "fw6 mb1 flex justify-between",
                  children: [
                    m.Div(budget.title),
                    m.Div(`₹ ${budget.amount.toLocaleString()}`),
                  ],
                }),
                m.Div({
                  class: "flex justify-between",
                  children: [
                    m.Span({
                      class: "f7 silver",
                      children: [
                        m.Span({
                          class: "flex items-center flex-wrap",
                          children: m.For({
                            subject: budget.allOf,
                            n: 0,
                            nthChild: m.Span("For transaction which is&nbsp;"),
                            map: (tag, index) =>
                              m.Span({
                                children: [
                                  m.If({
                                    subject: index === 0,
                                    isFalsy: () => m.Span("&nbsp;and&nbsp;"),
                                  }),
                                  m.B({
                                    class: "black",
                                    children: unstructuredValue(tag),
                                  }),
                                ],
                              }),
                          }),
                        }),
                        m.Span({
                          class: "flex items-center flex-wrap",
                          children: m.For({
                            subject: budget.oneOf,
                            n: 0,
                            nthChild: m.Span("and must be one of&nbsp;"),
                            map: (tag, index) =>
                              m.Span({
                                children: [
                                  m.If({
                                    subject: index === 0,
                                    isFalsy: () => ",&nbsp;",
                                  }),
                                  m.B({
                                    class: "black",
                                    children: unstructuredValue(tag),
                                  }),
                                ],
                              }),
                          }),
                        }),
                      ],
                    }),
                    m.Div({
                      class: "w-30 silver f7 flex justify-end",
                      children: `${budget.period}ly`,
                    }),
                  ],
                }),
              ],
            }),
        }),
      }),
      CardButton({
        onTap: () => goToPage(URL.EDIT.BUDGET),
        icon: "add",
        label: "Add new budget",
      }),
    ],
  });
});
