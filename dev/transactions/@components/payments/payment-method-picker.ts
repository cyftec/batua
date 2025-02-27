import { component } from "@mufw/maya";
import { derived, dstring, val } from "@cyftech/signal";
import { type PaymentMethod } from "../../../@libs/common";
import { DropDown } from "../../../@libs/elements";

type PaymentMethodPickerProps = {
  classNames?: string;
  selectedPaymentMethodCode: PaymentMethod["id"];
  onchange: (code: PaymentMethod["id"]) => void;
};

export const PaymentMethodPicker = component<PaymentMethodPickerProps>(
  ({ classNames, selectedPaymentMethodCode, onchange }) => {
    return DropDown({
      classNames: dstring`pa1 br3 ${classNames}`,
      options: derived(() =>
        [].map((pm) => ({
          isSelected: selectedPaymentMethodCode.value === pm.code,
          id: pm.code,
          label: pm.displayName,
        }))
      ),
      onchange: (optionId) => onchange(optionId as PaymentMethod["name"]),
    });
  }
);
