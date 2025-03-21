import { component } from "@mufw/maya";
import { derived, dstring, val } from "@cyftech/signal";
import { CURRENCIES, type CurrencyCode } from "../../@libs/common";
import { DropDown } from "../../@libs/elements";

type CurrencyPickerProps = {
  classNames?: string;
  selectedCurrencyCode: CurrencyCode;
  onchange: (code: CurrencyCode) => void;
  labelFormattor?: (code: CurrencyCode) => string;
};

export const CurrencyPicker = component<CurrencyPickerProps>(
  ({ classNames, selectedCurrencyCode, onchange, labelFormattor }) => {
    const getOptionLabel = (code: CurrencyCode) =>
      labelFormattor ? labelFormattor(code) : code;

    return DropDown({
      classNames: dstring`pa1 br3 ${classNames}`,
      options: derived(() =>
        Object.keys(CURRENCIES).map((curCode) => ({
          id: curCode,
          label: getOptionLabel(curCode as CurrencyCode),
          isSelected: curCode === selectedCurrencyCode.value,
        }))
      ),
      onchange: (id) => onchange(id as CurrencyCode),
    });
  }
);
