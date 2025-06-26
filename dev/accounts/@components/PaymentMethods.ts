import { component, m } from "@mufw/maya";
import { Button, Section } from "../../@libs/elements";
import { goToNewPaymentMethodPage } from "../../@libs/common/utils";
import { PaymentMethodUI } from "../../@libs/common/models/core";

type PaymentMethodsProps = {
  paymentMethods: PaymentMethodUI[];
};

export const PaymentMethods = component<PaymentMethodsProps>(
  ({ paymentMethods }) => {
    return m.Div({
      children: [
        Section({
          title: "My payment methods",
          children: m.For({
            subject: paymentMethods,
            map: (pm) =>
              m.Div({
                class: "mb3",
                children: pm.name,
              }),
          }),
        }),
        Button({
          onTap: goToNewPaymentMethodPage,
          cssClasses: "pv2 ph3",
          children: "Add new payment method",
        }),
      ],
    });
  }
);
