import { derive, DerivedSignal, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  DbRecordID,
  ID_KEY,
  newUnstructuredRecord,
  unstructuredValue,
} from "../../../../_kvdb";
import {
  Account,
  ACCOUNT_TYPES_LIST,
  AccountType,
  CURRENCY_TYPES,
  CurrencyType,
  PaymentMethod,
} from "../../../../models/core";
import { db } from "../../../../state/localstorage/stores";
import {
  areNamesSimilar,
  capitalize,
  deepTrim,
  nameRegex,
} from "../../../../state/utils";
import {
  Label,
  Link,
  NumberBox,
  Section,
  Select,
  TextBox,
} from "../../../elements";
import { EditPage, TagsSelector } from "../@components";

const error = signal("");
const editableAccount = signal<Account | undefined>(undefined);
const editableAccountName = derive(() => editableAccount.value?.name || "");
const account = signal<Account>({
  id: 0,
  isPermanent: false,
  name: "",
  type: "expense",
  uniqueId: undefined,
  vault: undefined,
  paymentMethods: undefined,
});
const {
  name: accName,
  type,
  uniqueId,
  vault,
  paymentMethods,
} = trap(account).props;
const accountTypeLabel = trap(type).concat(" account");
const initialAccBalance = signal(0);
const allPMs = signal<PaymentMethod[]>([]);
const unSelectedPaymentMethods = derive(() => {
  const selectedPmIDs = paymentMethods?.value?.map((pm) => pm[ID_KEY]);
  return allPMs.value.filter((pm) => !selectedPmIDs?.includes(pm[ID_KEY]));
});

const onPageMount = (urlParams: URLSearchParams) => {
  allPMs.value = db.paymentMethods.get();
  const typeStr = urlParams.get("type");
  if (typeStr && ACCOUNT_TYPES_LIST.includes(typeStr as AccountType)) {
    account.set({ type: typeStr as AccountType });
  }
  const idStr = urlParams.get("id");
  if (!idStr) return;
  const accID: DbRecordID = +idStr;
  const editableAcc = db.accounts.get(accID);
  if (!editableAcc) return;
  editableAccount.value = db.accounts.get(accID);
  account.set({ ...editableAcc });
};

const resetError = () => (error.value = "");

const onPaymentMethodTagTap = (tagIndex: number, isSelected: boolean) => {
  resetError();
  const pm = isSelected
    ? unSelectedPaymentMethods.value[tagIndex]
    : (paymentMethods?.value as PaymentMethod[])[tagIndex];

  account.set({
    paymentMethods: isSelected
      ? [...(paymentMethods?.value || []), pm]
      : (paymentMethods?.value as PaymentMethod[]).filter(
          (pmt) => pmt[ID_KEY] !== pm[ID_KEY]
        ),
  });
};

const onPaymentMethodAdd = (name: string) => {
  resetError();
  const newPmName = deepTrim(name);
  let existing = allPMs.value.find((pm) => areNamesSimilar(pm.name, newPmName));
  let selected =
    paymentMethods?.value &&
    paymentMethods.value.findIndex((pm) => pm.name === newPmName) > -1;

  if (existing) {
    if (selected) return false;
    account.set({
      paymentMethods: [...(paymentMethods?.value || []), existing],
    });
  } else {
    const newPM = db.paymentMethods.push({
      id: 0,
      isPermanent: false,
      name: newPmName,
      type: vault?.value as CurrencyType,
    });
    account.set({
      paymentMethods: [...(paymentMethods?.value || []), newPM],
    });
  }

  return true;
};

const validateForm = () => {
  let err = "";
  if (!accName.value) err = "Name is empty.";
  if (!nameRegex.test(accName.value)) err = "Invalid name for account.";
  error.value = err;
};

const onAccountSave = () => {
  const uniqueIdObj = uniqueId?.value ? { uniqueId: uniqueId.value } : {};
  const vaultObj =
    vault?.value && type.value === "expense" ? { vault: vault.value } : {};
  const updates: Pick<
    Account,
    "name" | "paymentMethods" | "vault" | "uniqueId"
  > = {
    name: accName.value,
    paymentMethods: paymentMethods?.value,
    ...vaultObj,
    ...uniqueIdObj,
  };

  if (editableAccount.value) {
    db.accounts.set(editableAccount.value.id, updates);
  } else {
    // TODO: Check existing account before adding new
    const newAccount: Account = {
      id: 0,
      isPermanent: false,
      type: type.value,
      ...updates,
    };
    const newAcc = db.accounts.push(newAccount);
    if (!initialAccBalance.value) return;
    const pmtID = db.payments.push({
      id: 0,
      amount: initialAccBalance.value,
      account: newAcc,
    });
    const firstBalanceUpdateTags = db.tags.filter((tag) =>
      ["balanceupdate", "initialbalance"].includes(unstructuredValue(tag))
    );
    const now = new Date();
    const title = "Set initial balance";
    let existingTitle = db.titles.find((tt) => unstructuredValue(tt) === title);
    if (!existingTitle)
      existingTitle = db.titles.push(newUnstructuredRecord(title));
    db.txns.push({
      id: 0,
      date: now,
      created: now,
      modified: now,
      type: "balance update",
      payments: [pmtID],
      tags: firstBalanceUpdateTags,
      title: existingTitle,
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
          text: accName,
          placeholder: "Account name",
          onchange: (text) => account.set({ name: text }),
        }),
        Label({ text: "Unique id" }),
        TextBox({
          cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
          text: uniqueId,
          placeholder: "Unique id (optional)",
          onchange: (text) => account.set({ uniqueId: text }),
        }),
        m.If({
          subject: editableAccount,
          isFalsy: () =>
            m.Div([
              Label({ text: "Initial balance" }),
              NumberBox({
                cssClasses: `mb2 fw5 ba b--light-silver bw1 br3 pa2 outline-0 w-100`,
                num: initialAccBalance,
                placeholder: "Unique id (optional)",
                onchange: (val) => (initialAccBalance.value = val),
              }),
            ]),
        }),
      ],
    }),
    m.If({
      subject: op(type).equals("expense").truthy,
      isTruthy: () =>
        Section({
          title: "Vault and payment methods",
          children: [
            Label({ text: "My money vault type" }),
            Select({
              cssClasses: "mb2 f6 br3",
              anchor: "left",
              options: CURRENCY_TYPES,
              selectedOptionIndex: trap(CURRENCY_TYPES).indexOf(
                vault as DerivedSignal<CurrencyType>
              ),
              targetFormattor: (option) => capitalize(option),
              optionFormattor: (option) => capitalize(option),
              onChange: (o) => account.set({ vault: CURRENCY_TYPES[o] }),
            }),
            Label({ text: "Payment Methods" }),
            TagsSelector({
              onAdd: onPaymentMethodAdd,
              onTagTap: onPaymentMethodTagTap,
              selectedTags: derive(() =>
                (paymentMethods?.value || []).map((pm) => pm.name)
              ),
              unSelectedTags: trap(unSelectedPaymentMethods).map((a) => a.name),
              textboxPlaceholder: "search and select, or create new",
            }),
          ],
        }),
    }),
  ]),
});
