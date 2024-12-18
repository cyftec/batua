import { type Component } from "@maya/core";
import { derived, dstr, val } from "@maya/signal";
import { type PaymentMethod } from "../../../@libs/common";
import { DropDown } from "../../../@libs/ui-kit";

type PaymentMethodPickerProps = {
  classNames?: string;
  selectedPaymentMethodCode: PaymentMethod["code"];
  onchange: (code: PaymentMethod["code"]) => void;
};

export const PaymentMethodPicker: Component<PaymentMethodPickerProps> = ({
  classNames,
  selectedPaymentMethodCode,
  onchange,
}) => {
  return DropDown({
    classNames: dstr`pa1 br3 ${classNames}`,
    options: derived(() =>
      [].map((pm) => ({
        isSelected: val(selectedPaymentMethodCode) === pm.code,
        id: pm.code,
        label: pm.displayName,
      }))
    ),
    onchange: (optionId) => onchange(optionId as PaymentMethod["name"]),
  });
};
