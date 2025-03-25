import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { ID, PaymentUI } from "../../../../@libs/common";
import {
  AddRemoveButtonPair,
  DropDown,
  NumberBox,
} from "../../../../@libs/elements";
import { allAccounts } from "../../../../@libs/stores/accounts";
import {
  allPaymentServices,
  getPaymentMethodUI,
} from "../../../../@libs/stores/payment-services";

type PaymentTileProps = {
  classNames?: string;
  payment: PaymentUI;
  hideRemoveButton?: boolean;
  onRemovePayment: (payment: PaymentUI) => void;
  onAddPayment: () => void;
  onUpdatePayment: (newPayment: PaymentUI) => void;
};

export const PaymentTile = component<PaymentTileProps>(
  ({
    classNames,
    payment,
    hideRemoveButton,
    onRemovePayment,
    onAddPayment,
    onUpdatePayment,
  }) => {
    const getAccountOptions = (payment: PaymentUI) =>
      allAccounts.value.map((acc) => ({
        id: acc.id,
        label: acc.name,
        isSelected: payment.paymentMethod.account.id === acc.id,
      }));

    return m.Div({
      class: dstring`flex items-center f6 ${classNames}`,
      children: [
        m.Div({
          class: "w-25 flex items-center",
          children: [
            m.Span({
              class: "mr1 f5 fw1 silver",
              children: payment.value.paymentMethod.account.currency.symbol,
            }),
            NumberBox({
              classNames: "w-100 bn f4",
              num: payment.value.amount,
              onchange: (amount) =>
                onUpdatePayment({ ...payment.value, amount }),
            }),
          ],
        }),
        m.Div({
          class: "w-75 flex items-center justify-between",
          children: [
            m.Div({
              class: "flex items-center",
              children: [
                m.Span({
                  class: "mh1",
                  children:
                    payment.value.amount > 0 ? "received in" : "paid from",
                }),
                DropDown({
                  classNames: "pa1 br2",
                  options: getAccountOptions(payment.value),
                  onchange: (optionId) =>
                    onUpdatePayment({
                      ...payment.value,
                      paymentMethod: getPaymentMethodUI(
                        payment.value.paymentMethod.id,
                        optionId as ID
                      ),
                    }),
                }),
                m.Span({ class: "mh1", children: " via " }),
                DropDown({
                  classNames: "pa1 br2",
                  options: allPaymentServices.value.map((ps) => ({
                    id: ps.id,
                    label: ps.name,
                    isSelected: payment.value.paymentMethod.id === ps.id,
                  })),
                  onchange: (optionId) =>
                    onUpdatePayment({
                      ...payment.value,
                      paymentMethod: getPaymentMethodUI(
                        optionId as ID,
                        payment.value.paymentMethod.account.id
                      ),
                    }),
                }),
              ],
            }),
            AddRemoveButtonPair({
              hideRemove: hideRemoveButton,
              onRemove: () => onRemovePayment(payment.value),
              onAdd: onAddPayment,
            }),
          ],
        }),
      ],
    });
  }
);
