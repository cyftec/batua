import { component, m } from "@mufw/maya";
import { PaymentMethodUI } from "../../@models/core";
import { URL, capitalize, goToPage, handleTap } from "../../@controller/utils";
import { CardButton, Icon, Section } from "../../@view/elements";

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
        n: 0,
        nthChild: CardButton({
          cssClasses: "w-48 mb3",
          onTap: () => goToPage(URL.EDIT.PAYMENT_METHOD),
          icon: "add",
          label: "Add new payment method",
        }),
        map: (pm, i) =>
          m.Div({
            onclick: pm.isPermanent
              ? undefined
              : handleTap(() =>
                  goToPage(URL.EDIT.PAYMENT_METHOD, { id: pm.id })
                ),
            class: `w-48 mb3 pa2 ba b--light-gray br4`,
            children: [
              m.Div({
                class: "w-100 f5 fw6 black flex items-center justify-between",
                children: [
                  pm.name,
                  m.If({
                    subject: pm.isPermanent,
                    isTruthy: () =>
                      Icon({
                        cssClasses: "silver",
                        iconName: "edit_off",
                        size: 14,
                      }),
                  }),
                ],
              }),
              m.If({
                subject: pm.uniqueId,
                isTruthy: () =>
                  m.Div({
                    class: "mt1 mb2 f7 fw4 black",
                    children: pm.uniqueId,
                  }),
              }),
              m.Div({
                class: "mt1 fw4 f6 flex items-center light-silver",
                children: [
                  Icon({
                    cssClasses: "mr1",
                    iconName: pm.type === "digital" ? "credit_card" : "paid",
                  }),
                  m.Span(capitalize(pm.type)),
                ],
              }),
            ],
          }),
      }),
    });
  }
);
