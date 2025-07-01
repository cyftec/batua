import { Child, component, m } from "@mufw/maya";
import { AccountUI } from "../../@libs/common/models/core";
import { capitalize, handleTap } from "../../@libs/common/utils";
import { op, tmpl, trap } from "@cyftech/signal";
import { Icon } from "../../@libs/elements";
import { Tag } from "../../@libs/components";

type AccountCardProps = {
  onTap?: () => void;
  cssClasses?: string;
  account: AccountUI;
};

export const AccountCard = component<AccountCardProps>(
  ({ onTap, cssClasses, account }) => {
    const { isPermanent, name, uniqueId, balance, type, vault, methods } =
      trap(account).props;

    return m.Div({
      onclick: handleTap(onTap),
      class: tmpl`ba b--light-gray br4 ph3 pt3 pb2 flex items-start justify-between ${cssClasses}`,
      children: [
        m.Div({
          class: "",
          children: [
            m.Div({
              class: "fw6 black flex items-center",
              children: [
                m.Div(name),
                m.If({
                  subject: isPermanent,
                  isFalsy: () =>
                    Icon({
                      cssClasses: "ml2 f8 silver",
                      iconName: "edit",
                    }),
                }),
              ],
            }),
            m.If({
              subject: uniqueId,
              isTruthy: () =>
                m.Div({
                  class: "mv2 flex items-center f7 fw4 black",
                  children: uniqueId,
                }),
            }),
            m.If({
              subject: vault,
              isTruthy: () =>
                m.Div({
                  class: "mv2 flex items-center f7 light-silver",
                  children: [
                    Icon({
                      cssClasses: "mr1",
                      iconName:
                        vault?.value === "digital" ? "credit_card" : "paid",
                    }),
                    m.Div(`${capitalize(vault?.value || "")} Asset`),
                  ],
                }),
              isFalsy: () =>
                m.Div(
                  m.If({
                    subject: op(type).equals("debt").truthy,
                    isTruthy: () =>
                      m.Div({
                        class: "mv2 flex items-center f7 light-silver",
                        children: [
                          Icon({
                            cssClasses: "mr1",
                            iconName: "credit_card_off",
                          }),
                          m.Div(`Debt`),
                        ],
                      }),
                  })
                ),
            }),
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: methods,
                n: 0,
                nthChild: m.Div({
                  class: "pt1 f8 light-silver",
                  children: m.If({
                    subject: trap(methods).length,
                    isTruthy: () => "Pay via:",
                  }),
                }),
                map: (pm) =>
                  Tag({
                    cssClasses: "mb2 ml2",
                    label: pm.name,
                    size: "small",
                    state: "idle",
                  }),
              }),
            }),
          ],
        }),
        m.Div({
          class: "f2dot66 flex items-start nt1",
          children: [
            m.Div({
              class: "flex items-center flex-column justify-end",
              children: [
                m.Div({
                  class: "f8 mt2",
                  children: "₹",
                }),
                // m.Div({
                //   class: "f3 nt2",
                //   children: "+",
                // }),
              ],
            }),
            m.Div(
              op(type)
                .equals("market")
                .ternary("&infin;", trap(balance).toLocaleString())
            ),
          ],
        }),
      ],
    });
  }
);
