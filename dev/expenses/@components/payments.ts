import { Component, derived, m } from "@maya/core";
import { Payment, paymentMethods } from "../../@libs/common";
import { DropDown, NumberBox } from "../../@libs/ui-kit";

type PaymentsProps = {
  payments: Payment[];
  onchange: (payments: Payment[]) => void;
};

export const Payments = Component<PaymentsProps>(({ payments, onchange }) => {
  const onPaymentsUpdate = (index: number, updated: Payment) => {
    const updatedPayments = [...payments.value];
    updatedPayments[index] = updated;
    onchange(updatedPayments);
  };

  return m.Div({
    children: m.For({
      items: payments,
      mutableMap: (item, i) =>
        PaymentTile({
          tileIndex: i,
          payment: item,
          onchange: onPaymentsUpdate,
        }),
    }),
  });
});

type PaymentTileProps = {
  tileIndex: number;
  payment: Payment;
  onchange: (tileIndex: number, updated: Payment) => void;
};

const PaymentTile = Component<PaymentTileProps>(
  ({ tileIndex, payment, onchange }) => {
    return m.Div({
      class: "flex items-center justify-between br3 bw1 ba b--light-gray",
      children: [
        NumberBox({
          classNames: "w-100 bn pl3 pr2 pv2",
          placeholder: "amount",
          num: derived(() => payment.value.amount),
          onchange: (val) => {
            onchange(tileIndex.value, {
              amount: val,
              currency: payment.value.currency,
              method: payment.value.method,
            });
          },
        }),
        DropDown({
          classNames: "pa1 br3 bn bg-near-white",
          options: derived(() =>
            paymentMethods.map((pm) => ({
              isSelected: payment.value.method.code === pm.code,
              id: pm.code,
              label: pm.displayName,
            }))
          ),
          onchange: (optionId) => {
            const selectedPaymentMethod = paymentMethods.find(
              (pm) => optionId === pm.code
            );
            onchange(tileIndex.value, {
              amount: payment.value.amount,
              method: selectedPaymentMethod || paymentMethods[0],
              currency: payment.value.currency,
            });
          },
        }),
      ],
    });
  }
);
