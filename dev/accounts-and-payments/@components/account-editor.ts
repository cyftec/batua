import {
  derived,
  dprops,
  dstring,
  effect,
  MaybeSignalObject,
  signal,
} from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  ACCOUNT_TYPE,
  AccountUI,
  CURRENCIES,
  Currency,
  ID,
  type AccountType,
} from "../../@libs/common";
import {
  Dialog,
  DropDown,
  FormField,
  Link,
  TextBox,
} from "../../@libs/elements";
import { addAccount, editAccount } from "../../@libs/stores/accounts";

type AccountEditorProps = {
  isOpen: boolean;
  editableAccount?: AccountUI;
  onCancel?: () => void;
  onDone?: () => void;
};

export const AccountEditor = component<AccountEditorProps>(
  ({ isOpen, editableAccount, onCancel, onDone }) => {
    const initAccount = (id: ID): AccountUI => ({
      id,
      type: "savings",
      name: "",
      uniqueId: undefined,
      balance: 0,
      currency: CURRENCIES.find((curr) => curr.code === "INR") as Currency,
    });
    const error = signal("");
    const isAccountEditorOpen = signal(false);
    const editedAccount = signal<AccountUI>(initAccount(crypto.randomUUID()));
    const dialogTitle = derived(() =>
      editedAccount.value
        ? `Edit account - '${editedAccount.value.name}'`
        : "Add new account"
    );

    const resetEditor = () => {
      error.value = "";
      editedAccount.value = initAccount(crypto.randomUUID());
      isAccountEditorOpen.value = false;
    };

    const validateEditingAccount = () => {
      console.log(error.value);
      const account = editedAccount.value;
      if (!account.name) {
        error.value = "Account name cannot be empty.";
        return;
      }
      error.value = "";
    };

    const saveAccount = async () => {
      const account = editedAccount.value;
      validateEditingAccount();
      if (error.value) return;

      if (editableAccount?.value) {
        await editAccount(account);
      } else {
        await addAccount(account);
      }
      onDone && onDone();
      resetEditor();
    };

    const onPrevAction = () => {
      onCancel && onCancel();
      resetEditor();
    };

    const {
      type: accountType,
      name,
      uniqueId,
      balance,
      currency,
    } = dprops(editedAccount);

    effect(() => {
      if (editableAccount?.value) {
        editedAccount.value = editableAccount.value;
      }
    });

    return Dialog({
      isOpen: isOpen,
      header: dialogTitle,
      prevLabel: "Cancel",
      nextLabel: "Save",
      onTapOutside: onPrevAction,
      onPrev: onPrevAction,
      onNext: saveAccount,
      child: m.Div({
        class: "w-100",
        children: [
          FormField({
            classNames: "mb3",
            label: "Account name",
            children: TextBox({
              classNames: "w-100 br2 ba bw1 b--light-gray pa2",
              text: name,
              placeholder: "account name",
              onchange: (value) => {
                console.log(value);
                editedAccount.value = {
                  ...editedAccount.value,
                  name: value,
                };
              },
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Account ID",
            children: TextBox({
              classNames: "flex w-100 br2 ba bw1 b--light-gray pa2",
              text: dstring`${uniqueId}`,
              placeholder: "account id (Optional)",
              onchange: (uniqueId) =>
                (editedAccount.value = {
                  ...editedAccount.value,
                  uniqueId,
                }),
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Account type",
            children: DropDown({
              classNames: "w-100 br2 pa2",
              options: derived(() =>
                Object.keys(ACCOUNT_TYPE).map((accKey) => ({
                  id: accKey,
                  label: ACCOUNT_TYPE[accKey],
                  isSelected: accountType.value == accKey,
                }))
              ),
              onchange: (accountType) =>
                (editedAccount.value = {
                  ...editedAccount.value,
                  type: accountType as AccountType,
                }),
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Account balance",
            children: [
              m.Div({
                class: "flex items-center mv2",
                children: [
                  m.Span({
                    class: "ml2 silver f6",
                    children: currency.value.symbol,
                  }),
                  m.Span({
                    class: "ml1 f3",
                    children: dstring`${() => {
                      console.log(editedAccount.value);
                      console.log(balance.value);
                      return balance.value.toFixed(2);
                    }}`,
                  }),
                ],
              }),
              Link({
                className: "ml2 f7",
                href: "/transactions?open=new",
                label: "change balance with a transaction",
                onClick: function (): void {
                  throw new Error("Function not implemented.");
                },
              }),
            ],
          }),
          m.If({
            subject: error,
            isTruthy: m.Div({
              class: "red",
              children: error as MaybeSignalObject<string>,
            }),
          }),
        ],
      }),
    });
  }
);
