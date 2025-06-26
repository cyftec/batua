import { component, m } from "@mufw/maya";
import { Button, Divider, Icon, Section } from "../../@libs/elements";
import { goToEditPaymentMethodPage, handleTap } from "../../@libs/common/utils";
import { PaymentMethodUI } from "../../@libs/common/models/core";

type PaymentMethodsProps = {
  paymentMethods: PaymentMethodUI[];
};

export const PaymentMethods = component<PaymentMethodsProps>(
  ({ paymentMethods }) => {
    return m.Div({
      children: [
        m.Div({
          class: "mt3",
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
                          class: "fw6",
                          children: pm.name,
                        }),
                        m.If({
                          subject: pm.uniqueId,
                          isTruthy: m.Div({
                            class: "mt2 f7 silver",
                            children: pm.uniqueId,
                          }),
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
          cssClasses: "mt4 pv2 ph3",
          children: "Add new payment method",
        }),
      ],
    });
  }
);
