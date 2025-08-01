import { derive, op, signal, tmpl, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  Account,
  CurrencyType,
  ExpenseAccount,
  PaymentMethod,
} from "../../../../models/core";
import { handleTap } from "../../../../state/utils";
import { Tag } from "../../../components";
import { Icon } from "../../../elements";
import { db } from "../../../../state/localstorage/stores";

type AccountCardProps = {
  onTap?: () => void;
  cssClasses?: string;
  account: Account;
};

export const AccountCard = component<AccountCardProps>(
  ({ onTap, cssClasses, account }) => {
    const { isPermanent, name, uniqueId, type } = trap(account).props;
    const accBalance = signal(0);
    const vault = derive(
      () => (account.value as ExpenseAccount).vault as CurrencyType | undefined
    );
    const paymentMethods = derive(
      () =>
        ((account.value as ExpenseAccount).paymentMethods ||
          []) as PaymentMethod[]
    );

    const onCardMount = () => {
      console.log(account.value);
      console.log(db.payments.get());
      const allPayments = db.payments.filter(
        (p) => p.account.id === account.value.id
      );
      const balance = allPayments.reduce((s, p) => s + p.amount, 0);
      accBalance.value = balance;
      // console.log(account.value, allPayments, balance, accBalance.value);
    };

    return m.Div({
      onmount: onCardMount,
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
                isTruthy: () =>
                  Icon({
                    cssClasses: "ml1 mt1",
                    iconName: "edit_off",
                    size: 14,
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
                    class: "f8 mb1 mid-gray flex items-center",
                    children: [
                      Icon({
                        cssClasses: "mr1",
                        size: 12,
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
                              cssClasses: "mr1 mb1",
                              size: "xsmall",
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
            m.Div(trap(accBalance).toLocaleString()),
          ],
        }),
      ],
    });
  }
);
