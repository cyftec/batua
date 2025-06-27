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
    return m.Div({
      children: [
        Section({
          contentCssClasses: "mt2 pt1",
          title: "My payment methods",
          children: m.For({
            subject: paymentMethods,
            map: (pm, i) =>
              m.Div({
                onclick: pm.isPermanent
                  ? undefined
                  : handleTap(() => goToEditPaymentMethodPage(pm.id)),
                class: `mb3 pa3 ba b--light-gray br4 flex items-center justify-between`,
                children: [
                  m.Div([
                    m.Div({
                      // class: "fw5",
                      children: pm.name,
                    }),
                    m.If({
                      subject: pm.uniqueId,
                      isTruthy: m.Div({
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
                            pm.mode === "digital" ? "credit_card" : "paid",
                        }),
                        m.Span(capitalize(pm.mode)),
                      ],
                    }),
                  ]),
                  m.If({
                    subject: pm.isPermanent,
                    isFalsy: Icon({
                      cssClasses: "ba b--light-silver br-100 pa2",
                      iconName: "edit",
                    }),
                  }),
                ],
              }),
          }),
        }),
        CardButton({
          cssClasses: "nt3",
          onTap: () => goToEditPaymentMethodPage(),
          icon: "add_card",
          label: "Add new payment method",
        }),
      ],
    });
  }
);
