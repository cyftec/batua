import { derive, effect, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { phase } from "@mufw/maya/utils";
import { db } from "../../@libs/common/localstorage/stores";
import {
  Account,
  AccountType,
  AccountUI,
  CURRENCY_TYPES,
  CurrencyType,
  PaymentMethodUI,
} from "../../@libs/common/models/core";
import {
  capitalize,
  getQueryParamValue,
  nameRegex,
} from "../../@libs/common/utils";
import { HTMLPage, NavScaffold, Tag } from "../../@libs/components";
import {
  DialogActionButtons,
  Icon,
  Label,
  Link,
  Select,
  TextBox,
} from "../../@libs/elements";
import { TableRecordID } from "../../@libs/kvdb";

const editableAccount = signal<AccountUI | undefined>(undefined);
const headerLabel = derive(() =>
  editableAccount.value
    ? `Edit '${editableAccount.value.name}'`
    : `Add my new account`
);

const error = signal("");
const accountName = signal("");
const accountUniqueId = signal("");
const accountType = signal<AccountType>("Expense");
const vaultType = signal<CurrencyType | undefined>(undefined);
const allPaymentMethods = signal<(PaymentMethodUI & { isSelected: boolean })[]>(
  []
);
const [selectedPaymentMethods, nonSelectedPaymentMethods] = trap(
  allPaymentMethods
).partition((pm) => pm.isSelected);
const commitBtnLabel = op(editableAccount).ternary("Save", "Add");

effect(() => {
  const vType = vaultType.value;
  const editableAccVal = editableAccount.value;
  if (!phase.currentIs("run")) return;
  const initialSelectendPmIDs = editableAccVal
    ? (editableAccVal.paymentMethods || []).map((pm) => pm.id)
    : [];
  allPaymentMethods.value = db.paymentMethods
    .getAll()
    .map((pm) => ({
      ...pm,
      isSelected: initialSelectendPmIDs.includes(pm.id),
    }))
    // TODO: Filter out slave payment methods as well
    .filter((pm) => pm.type === vType);
});

effect(() => {
  if (!editableAccount.value) return;
  accountType.value = editableAccount.value.type;
  accountName.value = editableAccount.value.name;
  accountUniqueId.value = editableAccount.value.uniqueId || "";
  vaultType.value = editableAccount.value.vault;
});

const onTagTap = (pmID: number, selectTag: boolean) => {
  allPaymentMethods.value = allPaymentMethods.value.map((pm) => {
    if (pm.id === pmID) pm.isSelected = selectTag;
    return pm;
  });
};

const validateForm = () => {
  if (!accountName.value) {
    error.value = "Name is empty.";
    return;
  }
  if (!nameRegex.test(accountName.value)) {
    error.value = "Invalid name for account.";
    return;
  }
  error.value = "";
};

const goBack = () => history.back();

const savePaymentMethod = () => {
  validateForm();
  if (error.value) return;
  const uniqueIdObj = accountUniqueId.value
    ? { uniqueId: accountUniqueId.value }
    : {};
  const vaultObj = vaultType.value ? { vault: vaultType.value } : {};
  const updates: Pick<
    Account,
    "name" | "paymentMethods" | "vault" | "uniqueId"
  > = {
    name: accountName.value,
    paymentMethods: selectedPaymentMethods.value.map((pm) => pm.id),
    ...vaultObj,
    ...uniqueIdObj,
  };

  if (editableAccount.value) {
    db.accounts.update(editableAccount.value.id, updates);
  } else {
    // TODO: Check existing account before adding new
    const newAccount: Account = {
      isPermanent: 0,
      balance: 0,
      type: "Expense",
      ...updates,
    };
    db.accounts.add(newAccount);
  }
  goBack();
};

const triggerPageDataRefresh = () => {
  vaultType.value = "digital";
  const idStr = getQueryParamValue("id");
  if (!idStr) return;
  const accID: TableRecordID = +idStr;
  editableAccount.value = db.accounts.get(accID);
};

const onPageMount = () => {
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: headerLabel,
    content: m.Div({
      children: [
        m.If({
          subject: editableAccount,
          isTruthy: () =>
            m.Div({
              class: "mb4 red",
              children: [
                Link({
                  onClick: () => {},
                  children: "Delete this account",
                }),
              ],
            }),
        }),
        m.If({
          subject: vaultType,
          isTruthy: (subject) =>
            m.Div([
              Label({ text: "My money vault type" }),
              Select({
                cssClasses: "mb2 f6 br3",
                anchor: "left",
                options: CURRENCY_TYPES,
                selectedOptionIndex: trap(CURRENCY_TYPES).indexOf(subject),
                targetFormattor: (option) => capitalize(option),
                optionFormattor: (option) => capitalize(option),
                onChange: (o) => (vaultType.value = CURRENCY_TYPES[o]),
              }),
            ]),
        }),
        Label({ text: "Name of account" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
          text: accountName,
          placeholder: "Account name",
          onchange: (text) => (accountName.value = text.trim()),
        }),
        Label({ text: "Unique id" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
          text: accountUniqueId,
          placeholder: "Unique id (optional)",
          onchange: (text) => (accountUniqueId.value = text.trim()),
        }),
        m.If({
          subject: trap(allPaymentMethods).length,
          isTruthy: () =>
            m.Div([
              Label({ text: "Payment Methods" }),
              m.Div({
                class: "ba br4 b--light-silver ph2",
                children: [
                  m.If({
                    subject: trap(selectedPaymentMethods).length,
                    isTruthy: () =>
                      Label({
                        text: "ACCEPTED PAYMENT METHODS (TAP TO DESELECT)",
                      }),
                  }),
                  m.Div({
                    class: "flex flex-wrap",
                    children: m.For({
                      subject: selectedPaymentMethods,
                      map: (pm) =>
                        Tag({
                          onClick: () => onTagTap(pm.id, false),
                          cssClasses: "mr2 mb2",
                          size: "medium",
                          state: "selected",
                          children: pm.name,
                        }),
                    }),
                  }),
                  m.If({
                    subject: trap(nonSelectedPaymentMethods).length,
                    isTruthy: () =>
                      Label({ text: "TAP TO SELECT PAYMENT METHOD" }),
                  }),
                  m.Div({
                    class: "flex flex-wrap",
                    children: m.For({
                      subject: nonSelectedPaymentMethods,
                      map: (pm) =>
                        Tag({
                          onClick: () => onTagTap(pm.id, true),
                          cssClasses: "mr2 mb2",
                          size: "medium",
                          state: "unselected",
                          children: pm.name,
                        }),
                    }),
                  }),
                ],
              }),
            ]),
        }),
      ],
    }),
    hideNavbar: true,
    navbarTop: DialogActionButtons({
      cssClasses: "sticky bottom-0 bg-near-white pv2 ph3 nl3 nr3",
      discardLabel: [
        Icon({ cssClasses: "nl2 mr2", iconName: "arrow_back" }),
        "Cancel",
      ],
      commitLabel: [
        Icon({ cssClasses: "nl3 mr2", iconName: commitBtnLabel }),
        commitBtnLabel,
      ],
      onDiscard: goBack,
      onCommit: savePaymentMethod,
    }),
  }),
});
