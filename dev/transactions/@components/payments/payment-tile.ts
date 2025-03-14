import { component, m } from "@mufw/maya";
import { derived, dstring, val } from "@cyftech/signal";
import { CURRENCIES, PaymentDB } from "../../../@libs/common";
import { Link, NumberBox } from "../../../@libs/elements";
import { CurrencyPicker } from "../currency-picker";
import { PaymentMethodPicker } from "./payment-method-picker";

type PaymentTileProps = {
  classNames?: string;
  payment: PaymentDB & { index: number };
  linkLabel: string;
  onLinkClick: (index: number) => void;
  onPaymentUpdate: (tileIndex: number, updated: PaymentDB) => void;
};

export const PaymentTile = component<PaymentTileProps>(
  ({ classNames, payment, linkLabel, onLinkClick, onPaymentUpdate }) => {
    const selectedCurrencyCode = derived(() => payment.value.currencyCode);
    const selectedPaymentMethodCode = derived(
      () => payment.value.paymentMethodCode
    );

    const onPaymentChange = <K extends keyof PaymentDB>(
      key: K,
      value: PaymentDB[K]
    ) => {
      onPaymentUpdate(payment.value.index, {
        ...payment.value,
        [key]: value,
      });
    };

    return m.Div({
      class: `flex items-center justify-between w-100`,
      children: [
        m.Div({
          class: dstring`flex items-center justify-between w-60 ${classNames}`,
          children: [
            PaymentMethodPicker({
              classNames: dstring`truncate mr2 f6`,
              selectedPaymentMethodCode,
              onchange: (pmCode) =>
                onPaymentChange("paymentMethodCode", pmCode),
            }),
            CurrencyPicker({
              classNames: "w3 mr3 f6",
              selectedCurrencyCode,
              onchange: (currCode) => onPaymentChange("currencyCode", currCode),
            }),
            m.Span({
              class: "",
              children: dstring`${() =>
                CURRENCIES[payment.value.currencyCode].symbol}`,
            }),
            NumberBox({
              classNames: "bn pv2 w-100",
              placeholder: "amount",
              num: derived(() => payment.value.amount),
              onchange: (amount) => onPaymentChange("amount", amount),
            }),
          ],
        }),
        Link({
          className: "mr2",
          label: linkLabel,
          onClick: () => onLinkClick(payment.value.index),
        }),
      ],
    });
  }
);
