import { component, m } from "@mufw/maya";
import { Button, Divider, Icon, Section } from "../../@libs/elements";
import {
  capitalize,
  goToEditPaymentMethodPage,
  handleTap,
} from "../../@libs/common/utils";
import { PaymentMethodUI } from "../../@libs/common/models/core";

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
                children: [
                  m.Div({
                    class: "mv3 flex items-center justify-between",
                    children: [
                      m.Div([
                        m.Div({
                          // class: "fw5",
                          children: pm.name,
                        }),
                        m.If({
                          subject: pm.uniqueId,
                          isTruthy: m.Div({
                            class: "mt2 f7 silver",
                            children: pm.uniqueId,
                          }),
                        }),
                        m.Div({
                          class: "mt2 fw4 f6 flex items-center",
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
                  m.If({
                    subject: i === paymentMethods.value.length - 1,
                    isFalsy: Divider({ cssClasses: "mt3" }),
                  }),
                ],
              }),
          }),
        }),
        Button({
          onTap: goToEditPaymentMethodPage,
          cssClasses: "mt0 pv2 ph3 flex items-center",
          children: [
            Icon({ cssClasses: "mr1", iconName: "add" }),
            "Add new payment method",
          ],
        }),
      ],
    });
  }
);
