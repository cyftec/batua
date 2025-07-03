import { component, m } from "@mufw/maya";
import { PaymentMethodUI } from "../../@libs/common/models/core";
import {
  capitalize,
  goToEditPaymentMethodPage,
  handleTap,
} from "../../@libs/common/utils";
import { CardButton, Icon, Section } from "../../@libs/elements";

type PaymentMethodsProps = {
  paymentMethods: PaymentMethodUI[];
};

export const PaymentMethods = component<PaymentMethodsProps>(
  ({ paymentMethods }) => {
    return Section({
      contentCssClasses: "flex flex-wrap justify-between",
      title: "Payment methods",
      children: m.For({
        subject: paymentMethods,
        n: Infinity,
        nthChild: CardButton({
          cssClasses: "w-48 mb3",
          onTap: () => goToEditPaymentMethodPage(),
          icon: "add_card",
          label: "Add new payment method",
        }),
        map: (pm, i) => {
          try {
            return m.Div({
              onclick: pm.isPermanent
                ? undefined
                : handleTap(() => goToEditPaymentMethodPage(pm.id)),
              class: `w-48 mb3 pa3 ba b--light-gray br4 flex items-center justify-between`,
              children: [
                m.Div([
                  m.Div({
                    // class: "fw5",
                    children: pm.name,
                  }),
                  m.If({
                    subject: pm.uniqueId,
                    isTruthy: () =>
                      m.Div({
                        class: "mt2 f7 fw4 black",
                        children: pm.uniqueId,
                      }),
                  }),
                  m.Div({
                    class: "mt2 fw4 f6 flex items-center light-silver",
                    children: [
                      Icon({
                        cssClasses: "mr2",
                        iconName:
                          pm.type === "digital" ? "credit_card" : "paid",
                      }),
                      m.Span(capitalize(pm.type)),
                    ],
                  }),
                ]),
                m.If({
                  subject: pm.isPermanent,
                  isFalsy: () =>
                    Icon({
                      cssClasses: "ba b--light-silver br-100 pa2",
                      iconName: "edit",
                    }),
                }),
              ],
            });
          } catch (error) {
            console.log(paymentMethods);
            console.log(pm);
          }
        },
      }),
    });
  }
);
