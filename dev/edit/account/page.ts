import { derive, effect, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { TableRecordID } from "../../@libs/kvdb";
import { db } from "../../@libs/common/localstorage/stores";
import {
  Account,
  AccountType,
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
  Section,
  Select,
  TextBox,
} from "../../@libs/elements";

const accIdFromQuery = signal("");
const editableAccount = derive(() => {
  if (!accIdFromQuery.value) return;
  const accID: TableRecordID = +accIdFromQuery.value;
  const acc = db.accounts.get(accID);
  if (!acc) throw `Error fetching account for id - ${accID}`;
  return acc;
});
const headerLabel = derive(() =>
  editableAccount.value
    ? `Edit '${editableAccount.value.name}'`
    : `Add my new account`
);

const error = signal("");
const accountName = signal("");
const accountUniqueId = signal("");
const accountType = signal<AccountType>("Expense");
const vaultType = signal<CurrencyType | undefined>("digital");
const allPaymentMethods = signal<(PaymentMethodUI & { isSelected: boolean })[]>(
  []
);
const [selectedPaymentMethods, nonSelectedPaymentMethods] = trap(
  allPaymentMethods
).partition((pm) => pm.isSelected);
const commitBtnLabel = op(editableAccount).ternary("Save", "Add");

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
  const id = getQueryParamValue("id");
  if (id) accIdFromQuery.value = id;
  const initialSelectendPmIDs = editableAccount.value
    ? (editableAccount.value.paymentMethods || []).map((pm) => pm.id)
    : [];
  const fetchedPMs = db.paymentMethods.getAll();
  allPaymentMethods.value = fetchedPMs.map((pm) => ({
    ...pm,
    isSelected: initialSelectendPmIDs.includes(pm.id),
  }));
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
        Section({
          title: "Account details",
          children: [
            m.If({
              subject: vaultType,
              isTruthy: (subject) =>
                m.Div([
                  Label({ text: "My money vault type" }),
                  Select({
                    cssClasses: "f6 br3 pa2",
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
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: accountName,
              placeholder: "Account name",
              onchange: (text) => (accountName.value = text.trim()),
            }),
            Label({ text: "Unique TableRecordID" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: accountUniqueId,
              placeholder: "Unique TableRecordID (optional)",
              onchange: (text) => (accountUniqueId.value = text.trim()),
            }),
          ],
        }),
        m.If({
          subject: vaultType,
          isTruthy: () =>
            Section({
              title: "Payment methods",
              children: [
                m.Div({
                  class: "flex flex-wrap",
                  children: m.For({
                    subject: selectedPaymentMethods,
                    map: (pm) =>
                      Tag({
                        onClick: () => onTagTap(pm.id, false),
                        cssClasses: "mr2 mt2",
                        size: "large",
                        state: "selected",
                        children: pm.name,
                      }),
                  }),
                }),
                m.If({
                  subject: trap(nonSelectedPaymentMethods).length,
                  isTruthy: () =>
                    m.Div({
                      class: "mt2 pt2 f7 silver",
                      children: "TAP TO SELECT METHODS FROM BELOW",
                    }),
                }),
                m.Div({
                  class: "flex flex-wrap",
                  children: m.For({
                    subject: nonSelectedPaymentMethods,
                    map: (pm) =>
                      Tag({
                        onClick: () => onTagTap(pm.id, true),
                        cssClasses: "mr2 mt2",
                        size: "large",
                        state: "unselected",
                        children: pm.name,
                      }),
                  }),
                }),
              ],
            }),
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
