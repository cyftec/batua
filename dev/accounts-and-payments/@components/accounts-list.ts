import { derived, type DerivedSignal, dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { type Account, CURRENCIES, type ID } from "../../@libs/common";
import { AddButtonTile, ListTile, SectionTitle } from "../../@libs/components";
import { Icon } from "../../@libs/elements";
import {
  addAccount,
  allAccounts,
  editAccount,
} from "../../@libs/stores/accounts";
import { AccountEditor } from "./account-editor";

type AccountsListProps = {
  classNames?: string;
};

export const AccountsList = component<AccountsListProps>(({ classNames }) => {
  const initAccount = (id: ID): Account => ({
    id,
    type: "savings",
    name: "",
    uniqueId: undefined,
    balance: 0,
    currency: "INR",
  });
  const error = signal("");
  const isAccountEditorOpen = signal(false);
  const editingAccountName = signal("");
  const editingAccount = signal<Account>(initAccount(crypto.randomUUID()));
  const editorDialogTitle = derived(() =>
    editingAccountName.value
      ? `Edit account - '${editingAccountName.value}'`
      : "Add new account"
  );

  const resetEditor = () => {
    editingAccount.value = initAccount(crypto.randomUUID());
    editingAccountName.value = "";
    error.value = "";
    isAccountEditorOpen.value = false;
  };

  const validateEditingAccount = () => {
    console.log(error.value);
    const account = editingAccount.value;
    if (!account.name) {
      error.value = "Account name cannot be empty.";
      return;
    }
    if (account.balance < 0) {
      error.value = "Account cannot have negative balance.";
      return;
    }
    error.value = "";
  };

  const saveAccount = async () => {
    const oldAccountName = editingAccountName.value;
    const account = editingAccount.value;
    validateEditingAccount();
    if (error.value) return;

    if (oldAccountName) {
      await editAccount(account);
    } else {
      await addAccount(account);
    }
    resetEditor();
  };

  return m.Div({
    class: dstring`${classNames}`,
    children: [
      AccountEditor({
        isOpen: isAccountEditorOpen,
        dialogTitle: editorDialogTitle,
        editingAccount: editingAccount,
        onChange: (account) => (editingAccount.value = account),
        onCancel: resetEditor,
        onSave: saveAccount,
      }),
      SectionTitle({
        iconName: "account_balance",
        label: "Spending and Investment Accounts",
      }),
      m.If({
        subject: allAccounts,
        isTruthy: m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: allAccounts as DerivedSignal<Account[]>,
            n: 1000,
            nthChild: AddButtonTile({
              classNames: "mr3 mt3 pt4 h4 w-43",
              onClick: () => (isAccountEditorOpen.value = true),
              children: [
                Icon({
                  className: "mb2",
                  size: 42,
                  iconName: "add",
                }),
                m.Div({
                  class: "light-silver f6",
                  children: "Add new account",
                }),
              ],
            }),
            map: (account) =>
              ListTile({
                classNames: "mr3 mt3 h4 w-43",
                title: account.name,
                subtitle: `(${account.currency}) ${
                  account.uniqueId ? `${account.uniqueId} ` : ""
                }`,
                onClick: () => {
                  editingAccountName.value = account.name;
                  editingAccount.value = account;
                  isAccountEditorOpen.value = true;
                },
                child: m.Div({
                  class: "mt3",
                  children: [
                    m.Span(
                      `${
                        CURRENCIES.find((c) => c.code === account.currency)
                          ?.symbol
                      }`
                    ),
                    m.Span({
                      class: "ml1 f3",
                      children: `${account.balance.toLocaleString("en-IN")}`,
                    }),
                  ],
                }),
              }),
          }),
        }),
      }),
    ],
  });
});
