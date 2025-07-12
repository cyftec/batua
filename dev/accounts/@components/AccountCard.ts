import { derive, op, tmpl, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  CapitalAccountUI,
  CurrencyType,
  ExpenseAccountUI,
  PaymentMethodUI,
  PeopleOrShopAccountUI,
} from "../../@libs/common/models/core";
import { handleTap } from "../../@libs/common/utils";
import { Tag } from "../../@libs/components";
import { Icon } from "../../@libs/elements";

type AccountCardProps = {
  onTap?: () => void;
  cssClasses?: string;
  account: ExpenseAccountUI | CapitalAccountUI | PeopleOrShopAccountUI;
};

const getRandomBalance = () =>
  (Math.random() * 25000).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

export const AccountCard = component<AccountCardProps>(
  ({ onTap, cssClasses, account }) => {
    const { isPermanent, name, uniqueId, balance, type } = trap(account).props;
    const vault = derive(
      () =>
        (account.value as ExpenseAccountUI).vault as CurrencyType | undefined
    );
    const paymentMethods = derive(
      () =>
        ((account.value as ExpenseAccountUI).paymentMethods ||
          []) as PaymentMethodUI[]
    );

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
            isTruthy: (subject) =>
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
                          subject.value === "digital" ? "credit_card" : "paid",
                      }),
                      m.Span("Pay via"),
                    ],
                  }),
                  m.If({
                    subject: trap(paymentMethods).length,
                    isTruthy: () =>
                      m.Div({
                        class: "flex flex-wrap",
                        children: m.For({
                          subject: paymentMethods,
                          map: (pm) =>
                            Tag({
                              size: "small",
                              state: "selected",
                              children: pm.name,
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
                  subject: op(type).equals("Loan").truthy,
                  isTruthy: () =>
                    m.Div({
                      class: "mv2 flex items-center f7 light-silver",
                      children: [
                        Icon({
                          cssClasses: "mr1",
                          iconName: "credit_card_off",
                        }),
                        m.Div(`Loan`),
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
              op(type).equals("Unknown").ternary("&infin;", getRandomBalance()) //trap(balance).toLocaleString()
            ),
          ],
        }),
      ],
    });
  }
);
