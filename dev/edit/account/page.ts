import { derive, effect, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { phase } from "@mufw/maya/utils";
import { db } from "../../@controller/localstorage/stores";
import {
  Account,
  ACCOUNT_TYPES_LIST,
  AccountType,
  AccountUI,
  CURRENCY_TYPES,
  CurrencyType,
  PaymentMethodUI,
} from "../../@controller/models/core";
import {
  areNamesSimilar,
  capitalize,
  deepTrim,
  nameRegex,
} from "../../@controller/utils";
import {
  Label,
  Link,
  NumberBox,
  Section,
  Select,
  TextBox,
} from "../../@view/elements";
import { getPrimitiveRecordValue, ID_KEY, TableRecordID } from "../../@kvdb";
import { EditPage, TagsSelector } from "../@components";

const editableAccount = signal<AccountUI | undefined>(undefined);
const editableAccountName = derive(() => editableAccount.value?.name || "");

const error = signal("");
const accountType = signal<AccountType>("expense");
const accountName = signal("");
const accountUniqueId = signal("");
const accountBalance = signal(0);
const accountTypeLabel = trap(accountType).concat(" account");
const vaultType = signal<CurrencyType>("physical");
const allPMs = signal<(PaymentMethodUI & { isSelected: boolean })[]>([]);
const [selectedPaymentMethods, unSelectedPaymentMethods] = trap(
  allPMs
).partition((pm) => pm.isSelected);

const onPageMount = (urlParams: URLSearchParams) => {
  vaultType.value = "digital";
  const typeStr = urlParams.get("type");
  if (typeStr && ACCOUNT_TYPES_LIST.includes(typeStr as AccountType)) {
    accountType.value = typeStr as AccountType;
  }
  const idStr = urlParams.get("id");
  if (!idStr) return;
  const accID: TableRecordID = +idStr;
  const editableAcc = db.accounts.get(accID);
  if (!editableAcc) return;
  editableAccount.value = db.accounts.get(accID);
  accountType.value = editableAcc.type;
  accountName.value = editableAcc.name;
  accountUniqueId.value = editableAcc.uniqueId || "";
  accountBalance.value = editableAcc.balance;
  if (editableAcc.type === "expense") {
    vaultType.value = editableAcc.vault;
  }
};

effect(() => {
  const vType = vaultType.value;
  const editableAcc = editableAccount.value;
  if (!phase.currentIs("run")) return;
  const initialSelectendPmIDs = editableAcc
    ? (editableAcc.paymentMethods || []).map((pm) => pm.id)
    : [];
  allPMs.value = db.paymentMethods
    .getAllWhere((pm) => pm.type === vType)
    .map((pm) => ({
      ...pm,
      isSelected: initialSelectendPmIDs.includes(pm.id),
    }));
  // TODO: Filter out slave payment methods as well
});

const resetError = () => (error.value = "");

const onPaymentMethodTagTap = (tagIndex: number, isSelected: boolean) => {
  resetError();
  const pm = isSelected
    ? unSelectedPaymentMethods.value[tagIndex]
    : selectedPaymentMethods.value[tagIndex];
  allPMs.value = allPMs.value.map((p) => {
    if (p.id === pm.id) p.isSelected = isSelected;
    return p;
  });
};

const onPaymentMethodAdd = (name: string) => {
  resetError();
  const newPmName = deepTrim(name);
  let existing = false;
  let unselected = false;
  const updatedAllPMs = allPMs.value.map((pm) => {
    const pmFound = areNamesSimilar(pm.name, newPmName);
    if (pmFound) {
      existing = true;
      unselected = !pm.isSelected;
      pm.isSelected = unselected ? true : pm.isSelected;
    }
    return pm;
  });

  if (existing) {
    if (unselected) allPMs.value = updatedAllPMs;
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
    allPMs.value = [...allPMs.value, { ...newPM, isSelected: true }];
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
  const vaultObj =
    vaultType.value && accountType.value === "expense"
      ? { vault: vaultType.value }
      : {};
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
      type: accountType.value,
      ...updates,
    };
    const newAccID = db.accounts.add(newAccount);
    if (!accountBalance.value) return;
    const pmtID = db.payments.add({
      amount: accountBalance.value,
      account: newAccID,
    });
    const tagIDs = db.tags.getAllWhere((tag) =>
      ["balanceupdate", "initialbalance"].includes(getPrimitiveRecordValue(tag))
    );
    const now = new Date().getTime();
    const txnTitle = "Set initial balance";
    let titleID = db.txnTitles.getWhere(
      (tt) => getPrimitiveRecordValue(tt) === txnTitle
    )?.[ID_KEY];
    if (!titleID) titleID = db.txnTitles.add(txnTitle);
    db.txns.add({
      date: now,
      created: now,
      modified: now,
      type: "balance update",
      payments: [pmtID],
      tags: tagIDs.map((t) => t[ID_KEY]),
      title: titleID,
    });
  }
};

export default EditPage({
  error: error,
  editableItemType: accountTypeLabel,
  editableItemTitle: editableAccountName,
  onMount: onPageMount,
  validateForm: validateForm,
  onSave: onAccountSave,
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
        m.If({
          subject: editableAccount,
          isFalsy: () =>
            m.Div([
              Label({ text: "Initial balance" }),
              NumberBox({
                cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
                num: accountBalance,
                placeholder: "Unique id (optional)",
                onchange: (val) => (accountBalance.value = val),
              }),
            ]),
        }),
      ],
    }),
    m.If({
      subject: op(accountType).equals("expense").truthy,
      isTruthy: () =>
        Section({
          title: "Vault and payment methods",
          children: [
            Label({ text: "My money vault type" }),
            Select({
              cssClasses: "mb2 f6 br3",
              anchor: "left",
              options: CURRENCY_TYPES,
              selectedOptionIndex: trap(CURRENCY_TYPES).indexOf(vaultType),
              targetFormattor: (option) => capitalize(option),
              optionFormattor: (option) => capitalize(option),
              onChange: (o) => (vaultType.value = CURRENCY_TYPES[o]),
            }),
            Label({ text: "Payment Methods" }),
            TagsSelector({
              onAdd: onPaymentMethodAdd,
              onTagTap: onPaymentMethodTagTap,
              selectedTags: trap(selectedPaymentMethods).map((p) => p.name),
              unSelectedTags: trap(unSelectedPaymentMethods).map((a) => a.name),
              textboxPlaceholder: "search and select, or create new",
            }),
          ],
        }),
    }),
  ]),
});
