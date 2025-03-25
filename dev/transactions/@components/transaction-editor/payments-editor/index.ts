import { derived, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  capitalise,
  PaymentUI,
  TRANSACTION_TYPE,
  TransactionType,
} from "../../../../@libs/common";
import { DropDown } from "../../../../@libs/elements";
import { getDefaultNewPayments } from "../../../../@libs/stores/payments";
import { PaymentTile } from "./payment-tile";

type PaymentsEditorProps = {
  classNames?: string;
  payments: PaymentUI[];
  transactionType: TransactionType;
  onchange?: (payments: PaymentUI[]) => void;
  onPaymentsChange: (payments: PaymentUI[]) => void;
  onTransactionTypeChange: (transactionType?: TransactionType) => void;
};

export const PaymentsEditor = component<PaymentsEditorProps>(
  ({
    classNames,
    payments,
    transactionType,
    onTransactionTypeChange,
    onPaymentsChange,
  }) => {
    const total = derived(() =>
      payments.value.reduce((sum, p) => sum + p.amount, 0)
    );

    const removePayment = (payment: PaymentUI) => {
      if (payments.value.length === 1) return;
      onPaymentsChange(payments.value.filter((p) => payment.id !== p.id));
    };

    const addNewPayment = () => {
      const newList = [...payments.value, ...getDefaultNewPayments()];
      console.log(newList);
      onPaymentsChange(newList);
    };

    const updatePayment = (payment: PaymentUI) => {
      const newPayments = payments.value.map((p) =>
        p.id === payment.id ? payment : p
      );
      onPaymentsChange(newPayments);
    };

    return m.Div({
      class: dstring`${classNames}`,
      children: [
        m.Div({
          class: "w-100",
          children: m.For({
            subject: payments,
            map: (payment) =>
              PaymentTile({
                payment: payment,
                onRemovePayment: removePayment,
                onAddPayment: addNewPayment,
                onUpdatePayment: updatePayment,
              }),
          }),
        }),
        m.Div({
          class: "w-100 flex items-center mt3 mb2 br3 pv2 f6 bg-near-white",
          children: [
            m.Span({
              class: "w-25 ml1 f4",
              children: dstring`₹ ${() => total.value}`,
            }),
            m.Div({
              class: "w-75 flex items-center",
              children: [
                m.Span({
                  class: "mr2",
                  children: "total",
                }),
                DropDown({
                  classNames: "w-100 mr2 pa1 br2 ba b--moon-gray bw1",
                  withBorder: true,
                  options: derived(() =>
                    Object.entries(TRANSACTION_TYPE).map(([key, val]) => ({
                      id: key,
                      label: `${capitalise(key)} (${val})`,
                      isSelected: key === transactionType.value,
                    }))
                  ),
                  onchange: (optionId) =>
                    onTransactionTypeChange(optionId as TransactionType),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }
);
