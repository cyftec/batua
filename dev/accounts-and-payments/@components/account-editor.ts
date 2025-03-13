import { m, component, Child, Children } from "@mufw/maya";
import { derived, dprops, dstring, val, type Signal } from "@cyftech/signal";
import {
  ACCOUNT_TYPE,
  CURRENCIES,
  type AccountDB,
  type AccountType,
  type CurrencyCode,
} from "../../@libs/common";
import {
  Dialog,
  DropDown,
  FormField,
  NumberBox,
  TextBox,
} from "../../@libs/elements";

type AccountEditorProps = {
  isOpen: boolean;
  dialogTitle: string;
  editingAccount: Signal<AccountDB>;
  onChange: (account: AccountDB) => void;
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

    const onAccountBalance = (value: number) =>
      onChange({
        ...editingAccount.value,
        balance: value,
      });

    const onCurrencyChange = (currCode: string) =>
      onChange({
        ...editingAccount.value,
        currency: currCode as CurrencyCode,
      });

    return Dialog({
      isOpen: isOpen,
      header: dialogTitle,
      prevLabel: "Cancel",
      nextLabel: "Save",
      onTapOutside: onCancel,
      onPrev: onCancel,
      onNext: onSave,
      child: m.Div({
        class: "w-100",
        children: [
          FormField({
            classNames: "mb3",
            label: "Account name",
            children: TextBox({
              classNames: "w-100 ba bw1 br2 b--light-gray pa2",
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
          }),
          FormField({
            classNames: "mb3",
            label: "Account ID",
            children: TextBox({
              classNames: "ba flex w-100 bw1 br2 b--light-gray pa2",
              text: dstring`${uniqueId}`,
              placeholder: "account id (Optional)",
              onchange: (uniqueId) =>
                onChange({
                  ...editingAccount.value,
                  uniqueId,
                }),
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Account type",
            children: DropDown({
              classNames: "br2 pa2 w-100",
              options: derived(() =>
                Object.keys(ACCOUNT_TYPE).map((accKey) => ({
                  id: accKey,
                  label: ACCOUNT_TYPE[accKey],
                  isSelected: accountType.value == accKey,
                }))
              ),
              onchange: (accountType) =>
                onChange({
                  ...editingAccount.value,
                  type: accountType as AccountType,
                }),
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Account balance",
            children: m.Div({
              class: "flex items-center",
              children: [
                DropDown({
                  classNames: "br2 pa2",
                  options: CURRENCIES.map((curr) => ({
                    id: curr.code,
                    label: curr.code,
                    isSelected: curr.code == currency.value,
                  })),
                  onchange: onCurrencyChange,
                }),
                NumberBox({
                  classNames: "ba bw1 br2 b--light-gray pa2 w-100",
                  placeholder: "account balance",
                  num: balance,
                  onchange: onAccountBalance,
                }),
              ],
            }),
          }),
        ],
      }),
    });
  }
);
