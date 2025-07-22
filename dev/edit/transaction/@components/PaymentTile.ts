import { derive, op, signal, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { AccountUI, Payment } from "../../../@libs/common/models/core";
import {
  Icon,
  NumberBox,
  Select,
  type SelectOption,
} from "../../../@libs/elements";

type PaymentTileProps = {
  payment: Payment;
  allAccounts: AccountUI[];
  onPeopleAccountAdd: () => void;
  onChange: (newPayment: Payment) => void;
  onRemove: () => void;
};

export const PaymentTile = component<PaymentTileProps>(
  ({ payment, allAccounts, onPeopleAccountAdd, onChange, onRemove }) => {
    const ADD_NEW_PERSON = "Add new person";
    const amountEditorFocused = signal(false);
    const { account, amount, via } = trap(payment).props;
    const accountOptions = derive(() => {
      const allAccs = allAccounts.value.map((acc) => ({
        label: acc.name,
        data: acc,
      }));
      return [
        ...allAccs,
        { label: "", data: { type: "People", name: ADD_NEW_PERSON } },
      ];
    });
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
      if (newAccountIndex === allAccounts.value.length) {
        onPeopleAccountAdd();
        return;
      }
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
              optionFormattor(option: SelectOption<AccountUI>, index) {
                return m.Div({
                  children: [
                    m.Div({
                      class: "f8 silver",
                      children: option.data?.type,
                    }),
                    m.Div({
                      class: `f6 black ${
                        option.data?.name === ADD_NEW_PERSON
                          ? "underline fw5"
                          : "fw6"
                      }`,
                      children: option.data?.name,
                    }),
                  ],
                });
              },
            }),
            m.If({
              subject: selectedAccPaymentMethods,
              isTruthy: (nonNullPms) => {
                const paymentMethodOptions = trap(nonNullPms).map((pm) => ({
                  label: pm.name,
                  data: pm,
                }));
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
                  targetFormattor: (option) => `via ${option.label}`,
                  optionFormattor: (option) =>
                    m.Div({
                      children: [
                        m.Div({
                          class: "light-silver f8",
                          children: `paid via`,
                        }),
                        m.Div({ class: "f6 fw6", children: option.label }),
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
