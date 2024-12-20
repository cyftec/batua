import { Component, m } from "@maya/core";
import { derived, dstr, val } from "@maya/signal";
import { CURRENCIES, Payment } from "../../../@libs/common";
import { Link, NumberBox } from "../../../@libs/ui-kit";
import { CurrencyPicker } from "../currency-picker";
import { PaymentMethodPicker } from "./payment-method-picker";

type PaymentTileProps = {
  classNames?: string;
  payment: Payment & { index: number };
  linkLabel: string;
  onLinkClick: (index: number) => void;
  onPaymentUpdate: (tileIndex: number, updated: Payment) => void;
};

export const PaymentTile: Component<PaymentTileProps> = ({
  classNames,
  payment,
  linkLabel,
  onLinkClick,
  onPaymentUpdate,
}) => {
  const selectedCurrencyCode = derived(() => val(payment).currencyCode);
  const selectedPaymentMethodCode = derived(
    () => val(payment).paymentMethodCode
  );

  const onPaymentChange = <K extends keyof Payment>(
    key: K,
    value: Payment[K]
  ) => {
    onPaymentUpdate(val(payment).index, {
      ...val(payment),
      [key]: value,
    });
  };

  return m.Div({
    class: `flex items-center justify-between w-100`,
    children: [
      m.Div({
        class: dstr`flex items-center justify-between w-60 ${classNames}`,
        children: [
          PaymentMethodPicker({
            classNames: dstr`truncate mr2 f6`,
            selectedPaymentMethodCode,
            onchange: (pmCode) => onPaymentChange("paymentMethodCode", pmCode),
          }),
          CurrencyPicker({
            classNames: "w3 mr3 f6",
            selectedCurrencyCode,
            onchange: (currCode) => onPaymentChange("currencyCode", currCode),
          }),
          m.Span({
            class: "",
            children: dstr`${() =>
              CURRENCIES[val(payment).currencyCode].symbol}`,
          }),
          NumberBox({
            classNames: "bn pv2 w-100",
            placeholder: "amount",
            num: derived(() => val(payment).amount),
            onchange: (amount) => onPaymentChange("amount", amount),
          }),
        ],
      }),
      Link({
        className: "mr2",
        label: linkLabel,
        onClick: () => onLinkClick(val(payment).index),
      }),
    ],
  });
};
