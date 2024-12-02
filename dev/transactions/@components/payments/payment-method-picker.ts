import { Component, derived, drstr } from "@maya/core";
import { PaymentMethodCode, paymentMethods } from "../../../@libs/common";
import { DropDown } from "../../../@libs/ui-kit";

type PaymentMethodPickerProps = {
  classNames?: string;
  selectedPaymentMethodCode: PaymentMethodCode;
  onchange: (code: PaymentMethodCode) => void;
};

export const PaymentMethodPicker = Component<PaymentMethodPickerProps>(
  ({ classNames, selectedPaymentMethodCode, onchange }) => {
    return DropDown({
      classNames: drstr`pa1 br3 bn bg-near-white ${classNames}`,
      options: derived(() =>
        paymentMethods.map((pm) => ({
          isSelected: selectedPaymentMethodCode.value === pm.code,
          id: pm.code,
          label: pm.displayName,
        }))
      ),
      onchange: (optionId) => onchange(optionId as PaymentMethodCode),
    });
  }
);
