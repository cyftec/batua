import { Component } from "@maya/core";
import { derived, dstr, val } from "@maya/signal";
import { CURRENCIES, CurrencyCode } from "../../@libs/common";
import { DropDown } from "../../@libs/ui-kit";

type CurrencyPickerProps = {
  classNames?: string;
  selectedCurrencyCode: CurrencyCode;
  onchange: (code: CurrencyCode) => void;
  labelFormattor?: (code: CurrencyCode) => string;
};

export const CurrencyPicker: Component<CurrencyPickerProps> = ({
  classNames,
  selectedCurrencyCode,
  onchange,
  labelFormattor,
}) => {
  const getOptionLabel = (code: CurrencyCode) =>
    labelFormattor ? labelFormattor(code) : code;

  return DropDown({
    classNames: dstr`pa1 br3 bn bg-near-white ${classNames}`,
    options: derived(() =>
      Object.keys(CURRENCIES).map((curCode) => ({
        id: curCode,
        label: getOptionLabel(curCode as CurrencyCode),
        isSelected: curCode === val(selectedCurrencyCode),
      }))
    ),
    onchange: (id) => onchange(id as CurrencyCode),
  });
};
