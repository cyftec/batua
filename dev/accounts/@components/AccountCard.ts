import { Child, component, m } from "@mufw/maya";
import { AccountUI, PaymentMethodUI } from "../../@libs/common/models/core";
import { capitalize, handleTap } from "../../@libs/common/utils";
import { MaybeSignalValue, op, tmpl, trap } from "@cyftech/signal";
import { Icon } from "../../@libs/elements";
import { Tag } from "../../@libs/components";

type AccountCardProps = {
  onTap?: () => void;
  cssClasses?: string;
  account: AccountUI;
  paymentMethods?: PaymentMethodUI[];
};

const getRandomBalance = () =>
  (Math.random() * 25000).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

export const AccountCard = component<AccountCardProps>(
  ({ onTap, cssClasses, account, paymentMethods }) => {
    const { isPermanent, name, uniqueId, balance, type, vault } =
      trap(account).props;

    return m.Div({
      onclick: handleTap(onTap),
      class: tmpl`ba b--light-gray br4 pa2 flex flex-column justify-between ${cssClasses}`,
      children: [
        m.Div([
          m.Div({
            class: "f5 fw6 black flex items-start justify-between",
            children: [
              m.Div(name),
              m.If({
                subject: isPermanent,
                isFalsy: () =>
                  Icon({
                    cssClasses: "ml1 mt1 silver",
                    size: 10,
                    iconName: "edit",
                  }),
              }),
            ],
          }),
          m.If({
            subject: uniqueId,
            isTruthy: () =>
              m.Div({
                class: "mt1 mb2 flex items-center f7 fw4 black",
                children: uniqueId,
              }),
          }),
          m.If({
            subject: vault,
            isTruthy: () =>
              m.Div({
                class: "mt2 mb3",
                children: [
                  m.Div({
                    class: "f7 mb1 mig-gray flex items-center",
                    children: [
                      Icon({
                        cssClasses: "mr1",
                        size: 20,
                        iconName:
                          vault?.value === "digital" ? "credit_card" : "paid",
                      }),
                      m.Span("Pay via"),
                    ],
                  }),
                  m.If({
                    subject: trap(
                      paymentMethods as MaybeSignalValue<PaymentMethodUI[]>
                    ).length,
                    isTruthy: () =>
                      m.Div({
                        class: "flex flex-wrap",
                        children: m.For({
                          subject: paymentMethods as MaybeSignalValue<
                            PaymentMethodUI[]
                          >,
                          map: (pm) =>
                            Tag({
                              label: pm.name,
                              size: "small",
                              state: "selected",
                            }),
                        }),
                      }),
                    isFalsy: () =>
                      m.Div({
                        class: "f7",
                        children: `No Payment Method added`,
                      }),
                  }),
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
        ]),
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
              ],
            }),
            m.Div(
              op(type).equals("World").ternary("&infin;", getRandomBalance()) //trap(balance).toLocaleString()
            ),
          ],
        }),
      ],
    });
  }
);
