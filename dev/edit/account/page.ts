import { derive, effect, signal, trap } from "@cyftech/signal";
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
  areNamesSimilar,
  capitalize,
  deepTrim,
  nameRegex,
} from "../../@libs/common/utils";
import { Label, Link, Section, Select, TextBox } from "../../@libs/elements";
import { TableRecordID } from "../../@libs/kvdb";
import { EditPage, TagsSelector } from "../@components";

const editableAccount = signal<AccountUI | undefined>(undefined);
const editableAccountName = derive(() => editableAccount.value?.name || "");

const error = signal("");
const accountName = signal("");
const accountUniqueId = signal("");
const accountType = signal<AccountType>("Expense");
const vaultType = signal<CurrencyType>("physical");
const allPaymentMethods = signal<(PaymentMethodUI & { isSelected: boolean })[]>(
  []
);
const [selectedPaymentMethods, unSelectedPaymentMethods] = trap(
  allPaymentMethods
).partition((pm) => pm.isSelected);
const tagsSelectorPlaceholder = derive(() =>
  unSelectedPaymentMethods.value.length
    ? "search or create new"
    : "create new payment method"
);

const onMount = (urlParams: URLSearchParams) => {
  vaultType.value = "digital";
  const idStr = urlParams.get("id");
  if (!idStr) return;
  const accID: TableRecordID = +idStr;
  editableAccount.value = db.accounts.get(accID);
};

effect(() => {
  const vType = vaultType.value;
  const editableAcc = editableAccount.value;
  if (!phase.currentIs("run")) return;
  const initialSelectendPmIDs = editableAcc
    ? (editableAcc.paymentMethods || []).map((pm) => pm.id)
    : [];
  allPaymentMethods.value = db.paymentMethods
    .getAllWhere((pm) => pm.type === vType)
    .map((pm) => ({
      ...pm,
      isSelected: initialSelectendPmIDs.includes(pm.id),
    }));
  // TODO: Filter out slave payment methods as well
});

effect(() => {
  const editableAcc = editableAccount.value;
  if (!editableAcc) return;
  accountType.value = editableAcc.type;
  accountName.value = editableAcc.name;
  accountUniqueId.value = editableAcc.uniqueId || "";
  if (editableAcc.type === "Expense") {
    vaultType.value = editableAcc.vault;
  }
});

const resetError = () => (error.value = "");

const onPaymentMethodTagTap = (tagIndex: number, isSelected: boolean) => {
  resetError();
  const pm = isSelected
    ? unSelectedPaymentMethods.value[tagIndex]
    : selectedPaymentMethods.value[tagIndex];
  allPaymentMethods.value = allPaymentMethods.value.map((p) => {
    if (p.id === pm.id) p.isSelected = isSelected;
    return p;
  });
};

const onPaymentMethodAdd = (name: string) => {
  resetError();
  const newPmName = deepTrim(name);
  let existing = false;
  let unselected = false;
  const updatedAllPMs = allPaymentMethods.value.map((pm) => {
    const pmFound = areNamesSimilar(pm.name, newPmName);
    if (pmFound) {
      existing = true;
      unselected = !pm.isSelected;
      pm.isSelected = unselected ? true : pm.isSelected;
    }
    return pm;
  });

  if (existing) {
    if (unselected) allPaymentMethods.value = updatedAllPMs;
    else return false;
  } else {
    const newPmID = db.paymentMethods.add({
      isPermanent: 0,
      name: newPmName,
      type: vaultType.value,
      slave: false,
    });
    const newPM = db.paymentMethods.get(newPmID);
    if (!newPM) throw `Error fetching the new tag after adding it to the DB.`;
    allPaymentMethods.value = [
      ...allPaymentMethods.value,
      { ...newPM, isSelected: true },
    ];
  }

  return true;
};

const validateForm = () => {
  let err = "";
  if (!accountName.value) err = "Name is empty.";
  if (!nameRegex.test(accountName.value)) err = "Invalid name for account.";
  error.value = err;
};

const onAccountSave = () => {
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
};

export default EditPage({
  error: error,
  editableItemType: "account",
  editableItemTitle: editableAccountName,
  validateForm: validateForm,
  onSave: onAccountSave,
  onMount: onMount,
  content: m.Div([
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
      title: "Basic details",
      children: [
        Label({ text: "Name of account" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
          text: accountName,
          placeholder: "Account name",
          onchange: (text) => (accountName.value = text),
        }),
        Label({ text: "Unique id" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
          text: accountUniqueId,
          placeholder: "Unique id (optional)",
          onchange: (text) => (accountUniqueId.value = text),
        }),
      ],
    }),
    m.If({
      subject: vaultType,
      isTruthy: (subject) =>
        Section({
          title: "Vault and payment methods",
          children: [
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
            Label({ text: "Payment Methods" }),
            TagsSelector({
              onAdd: onPaymentMethodAdd,
              onTagTap: onPaymentMethodTagTap,
              cssClasses: "",
              selectedTags: trap(selectedPaymentMethods).map((p) => p.name),
              unSelectedTags: trap(unSelectedPaymentMethods).map((a) => a.name),
              textboxPlaceholder: tagsSelectorPlaceholder,
            }),
          ],
        }),
    }),
  ]),
});
