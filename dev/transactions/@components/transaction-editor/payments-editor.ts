import { derived, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  capitalise,
  PaymentUI,
  TRANSACTION_TYPE,
  TransactionType,
} from "../../../@libs/common";
import {
  AddRemoveButtonPair,
  DropDown,
  NumberBox,
} from "../../../@libs/elements";
import { allAccounts } from "../../../@libs/stores/accounts";
import { allPaymentServices } from "../../../@libs/stores/payment-services";
import { getDefaultNewPayments } from "../../../@libs/stores/payments";

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
    const addNewPayment = () => {
      const newList = [...payments.value, ...getDefaultNewPayments()];
      console.log(newList);
      onPaymentsChange(newList);
    };

    const removePayment = (payment: PaymentUI) => {
      if (payments.value.length === 1) return;
      onPaymentsChange(payments.value.filter((p) => payment.id !== p.id));
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
              m.Div({
                class: "flex items-center mb2 f6",
                children: [
                  m.Div({
                    class: "w-25 flex items-center",
                    children: [
                      m.Span({
                        class: "mr1 f5 fw1 silver",
                        children: payment.paymentMethod.account.currency.symbol,
                      }),
                      NumberBox({
                        classNames: "w-100 bn f4",
                        num: payment.amount,
                        onchange: (amount) =>
                          updatePayment({ ...payment, amount }),
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
                              payment.amount > 0 ? "received in" : "paid from",
                          }),
                          DropDown({
                            classNames: "pa1 br2",
                            options: allAccounts.value.map((acc) => ({
                              id: acc.id,
                              label: acc.name,
                              isSelected:
                                payment.paymentMethod.account.id === acc.id,
                            })),
                            onchange: function (optionId: string): void {
                              throw new Error("Function not implemented.");
                            },
                          }),
                          m.Span({ class: "mh1", children: " via " }),
                          DropDown({
                            classNames: "pa1 br2",
                            options: allPaymentServices.value.map((ps) => ({
                              id: ps.id,
                              label: ps.name,
                              isSelected: payment.paymentMethod.id === ps.id,
                            })),
                            onchange: function (optionId: string): void {
                              throw new Error("Function not implemented.");
                            },
                          }),
                        ],
                      }),
                      AddRemoveButtonPair({
                        hideRemove: derived(() => payments.value.length < 2),
                        onRemove: () => removePayment(payment),
                        onAdd: addNewPayment,
                      }),
                    ],
                  }),
                ],
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
