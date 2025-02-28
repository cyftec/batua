import { m, component } from "@mufw/maya";
import { derived, dprops, dstring, val, type Signal } from "@cyftech/signal";
import {
  ACCOUNT_TYPE,
  CURRENCIES,
  type Account,
  type AccountType,
  type CurrencyCode,
} from "../../@libs/common";
import { Dialog, DropDown, NumberBox, TextBox } from "../../@libs/elements";

type AccountEditorProps = {
  isOpen: boolean;
  dialogTitle: string;
  editingAccount: Signal<Account>;
  onChange: (account: Account) => void;
  onCancel: () => void;
  onSave: () => void;
};

export const AccountEditor = component<AccountEditorProps>(
  ({ isOpen, dialogTitle, editingAccount, onChange, onCancel, onSave }) => {
    const {
      type: accountType,
      name,
      uniqueId,
      balance,
      currency,
    } = dprops(editingAccount);

    return Dialog({
      isOpen: isOpen,
      header: dialogTitle,
      prevLabel: "Cancel",
      nextLabel: "Save",
      onTapOutside: onCancel,
      onPrev: onCancel,
      onNext: onSave,
      child: m.Div({
        children: [
          TextBox({
            classNames: "mb3 ba bw1 br2 b--light-gray pa2 w-100",
            text: name,
            placeholder: "account name",
            onchange: (value) => {
              console.log(value);
              onChange({
                ...editingAccount.value,
                name: value,
              });
            },
          }),
          m.Div({
            class: "mb3 flex items-center justify-between",
            children: [
              NumberBox({
                classNames: "ba bw1 br2 b--light-gray pa2 w-100",
                placeholder: "account balance",
                num: balance,
                onchange: (value) =>
                  onChange({
                    ...editingAccount.value,
                    balance: value,
                  }),
              }),
              DropDown({
                classNames: "ml3 br2 pa2",
                options: CURRENCIES.map((curr) => ({
                  id: curr.code,
                  label: curr.code,
                  isSelected: curr.code == currency.value,
                })),
                onchange: (currCode) =>
                  onChange({
                    ...editingAccount.value,
                    currency: currCode as CurrencyCode,
                  }),
              }),
              DropDown({
                classNames: "ml3 br2 pa2",
                options: derived(() =>
                  Object.keys(ACCOUNT_TYPE).map((at) => ({
                    id: at,
                    label:
                      at.charAt(0).toUpperCase() +
                      at.substring(1, at.length) +
                      " Account",
                    isSelected: accountType.value == at,
                  }))
                ),
                onchange: (accountType) =>
                  onChange({
                    ...editingAccount.value,
                    type: accountType as AccountType,
                  }),
              }),
            ],
          }),
          TextBox({
            classNames: "ba bw1 br2 b--light-gray pa2 w-100",
            text: dstring`${uniqueId}`,
            placeholder: "account id (Optional)",
            onchange: (uniqueId) =>
              onChange({
                ...editingAccount.value,
                uniqueId,
              }),
          }),
        ],
      }),
    });
  }
);
