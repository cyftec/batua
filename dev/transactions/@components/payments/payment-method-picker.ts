import { component } from "@mufw/maya";
import { derived, dstring, val } from "@cyftech/signal";
import { type PaymentMethodDB } from "../../../@libs/common";
import { DropDown } from "../../../@libs/elements";

type PaymentMethodPickerProps = {
  classNames?: string;
  selectedPaymentMethodCode: PaymentMethodDB["id"];
  onchange: (code: PaymentMethodDB["id"]) => void;
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
      onchange: (optionId) => onchange(optionId as PaymentMethodDB["name"]),
    });
  }
);
