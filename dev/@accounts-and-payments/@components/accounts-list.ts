import { component, m } from "@mufw/maya";
import {
  derived,
  type DerivedSignal,
  dpromise,
  dstring,
  signal,
} from "@cyftech/signal";
import { type Account, CURRENCIES, type ID } from "../../@libs/common";
import { db } from "../../@libs/storage/localdb/setup/db";
import { Icon } from "../../@libs/elements";
import { AddButtonTile, ListTile, SectionTitle } from "../../@libs/components";
import { AccountEditor } from "./account-editor";
import { phase } from "@mufw/maya/utils";

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
  const [fetchAccounts, accounts] = dpromise(() => db.accounts.getAll());

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
    if (!phase.currentIs("build")) {
      const oldAccountName = editingAccountName.value;
      const account = editingAccount.value;
      validateEditingAccount();
      if (error.value) return;

      if (oldAccountName) {
        await db.accounts.put(account);
      } else {
        await db.accounts.add(account);
      }

      fetchAccounts();
    }
    resetEditor();
  };

  return m.Div({
    onmount: fetchAccounts,
    class: dstring`${classNames}`,
    children: [
      AccountEditor({
        isOpen: isAccountEditorOpen,
        dialogTitle: derived(() =>
          editingAccountName.value
            ? `Edit account - '${editingAccountName.value}'`
            : "Add new account"
        ),
        editingAccount: editingAccount,
        onChange: (account) => (editingAccount.value = account),
        onCancel: resetEditor,
        onSave: saveAccount,
      }),
      SectionTitle({
        classNames: "mt2 mb4",
        iconName: "account_balance",
        label: "Spending and Investment Accounts",
      }),
      m.If({
        subject: accounts,
        isTruthy: m.Div({
          class: "flex flex-wrap nl4",
          children: m.For({
            subject: accounts as DerivedSignal<Account[]>,
            n: 1000,
            nthChild: AddButtonTile({
              classNames: "ba bw1 b--near-white ml4 mb4 pt4 h4 w-43",
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
                classNames: "ba bw1 b--near-white ml4 mb4 h4 w-43",
                title: account.name,
                subtitle: `${account.uniqueId ? `${account.uniqueId} ` : ""}(${
                  account.currency
                })`,
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
