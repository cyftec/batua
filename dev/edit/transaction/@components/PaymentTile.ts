import { derive, effect, op, signal, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  AccountUI,
  Payment,
  PaymentMethodUI,
} from "../../../@libs/common/models/core";
import { Icon, NumberBox, Select } from "../../../@libs/elements";

type PaymentTileProps = {
  allAccounts: AccountUI[];
  payment: Payment;
  onChange: (newPayment: Payment) => void;
  onRemove: () => void;
};

export const PaymentTile = component<PaymentTileProps>(
  ({ allAccounts, payment, onChange, onRemove }) => {
    const amountEditorFocused = signal(false);
    const { account, amount, via } = trap(payment).props;
    const accountOptions = trap(allAccounts).map((acc) => acc.name);
    const selectedAccountIndex = trap(allAccounts).findIndex(
      (acc) => acc.id === account.value
    );
    const selectedAccPaymentMethods = derive(() =>
      amount.value >= 0
        ? undefined
        : allAccounts.value[selectedAccountIndex.value].paymentMethods
    );

    const onAmountChange = (newAmount: number) =>
      onChange({ ...payment.value, amount: newAmount });

    const onAccountChange = (newAccountIndex: number) => {
      onChange({
        ...payment.value,
        account: allAccounts.value[newAccountIndex].id,
        via: allAccounts.value[newAccountIndex]?.paymentMethods?.[0].id,
      });
    };

    return m.Div({
      class: "flex items-center justify-between mt2",
      children: [
        m.Div({
          class: "w-25 flex items-center",
          children: [
            m.If({
              subject: op(amount).isLT(0).or(amountEditorFocused).truthy,
              isFalsy: () => m.Span({ class: "f5 fw3", children: "+" }),
            }),
            NumberBox({
              cssClasses: "w-100 f5 bn pa0 tl",
              num: amount,
              onchange: onAmountChange,
              onFocusChange: (focused) => (amountEditorFocused.value = focused),
            }),
          ],
        }),
        m.Div({
          class: "flex items-center",
          children: [
            m.Span({
              class: "mr1 f8 fw6 black",
              children: op(amount).isLT(0).ternary("from", "to"),
            }),
            Select({
              anchor: "right",
              size: "small",
              options: accountOptions,
              selectedOptionIndex: selectedAccountIndex,
              onChange: onAccountChange,
            }),
            m.If({
              subject: selectedAccPaymentMethods,
              isTruthy: (nonNullPms) => {
                const paymentMethodOptions = trap(nonNullPms).map(
                  (pm) => pm.name
                );
                const selectedPaymentMethodIndex = trap(nonNullPms).findIndex(
                  (pm) =>
                    via?.value === undefined ? true : pm.id === via.value
                );
                const onPaymentMethodChange = (newPmIndex: number) =>
                  onChange({
                    ...payment.value,
                    via: nonNullPms.value[newPmIndex].id,
                  });

                return Select({
                  anchor: "right",
                  size: "small",
                  options: paymentMethodOptions,
                  selectedOptionIndex: selectedPaymentMethodIndex,
                  targetFormattor: (option) => `via ${option}`,
                  optionFormattor: (option) =>
                    m.Div({
                      children: [
                        m.Div({
                          class: "light-silver f8",
                          children: `paid via`,
                        }),
                        m.Div({ class: "f6 fw6", children: option }),
                      ],
                    }),
                  onChange: onPaymentMethodChange,
                });
              },
            }),
            Icon({
              cssClasses: "ba bw1 br-100 b--light-silver ml1 pa1",
              size: 10,
              iconName: "close",
              onClick: onRemove,
            }),
          ],
        }),
      ],
    });
  }
);
