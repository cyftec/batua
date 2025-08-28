import { ID_KEY, newUnstructuredRecord, unstructuredValue } from "@cyftec/kvdb";
import { derive, effect, signal, trap } from "@cyftech/signal";
import {
  Account,
  ACCOUNT_TYPES_LIST,
  AccountType,
  CurrencyType,
} from "../../../models/data-models";
import { areStringsSimilar, nameRegex } from "../../utils";
import { store } from "../state";
import { getItemEditor } from "./item-editor";

export const getAccountEditor = () => {
  const initialAccBalance = signal(0);

  const accountValidator = (acc: Account) => {
    if (!acc.name) return "Name is empty.";
    else if (!nameRegex.test(acc.name)) return "Invalid name for account.";
    else return "";
  };

  const {
    initializeEditor,
    editableItemTitle,
    item: editingAccount,
    itemProps,
    itemProps: { type, vault, paymentMethods },
    error,
    onChange,
    onFormValidate,
    onSave,
  } = getItemEditor<Account>(store.accounts, "name", accountValidator);
  const accountTypeLabel = trap(type).concat(" account");
  const unSelectedPaymentMethods = derive(() => {
    const selectedPmIDs = paymentMethods?.value?.map((pm) => pm[ID_KEY]);
    return store.paymentMethods.list.value.filter(
      (pm) => !selectedPmIDs?.includes(pm[ID_KEY]) && vault?.value === pm.type
    );
  });

  effect(() => console.log(`paymentMethods: `, paymentMethods?.value));

  const onPageMount = (urlParams: URLSearchParams) => {
    store.initialize();
    let initialAccData: Partial<Account> = {};
    const typeStr = urlParams.get("type") as AccountType;
    if (typeStr && ACCOUNT_TYPES_LIST.includes(typeStr)) {
      initialAccData = {
        type: typeStr,
        vault: typeStr === "expense" ? "digital" : undefined,
      };
    }
    const editableAccId = +(urlParams.get("id") || "");
    initializeEditor(editableAccId, initialAccData);
  };

  const onMethodSelectionChange = (tagName: string, isSelected: boolean) => {
    const selectedPMs = paymentMethods?.value || [];

    if (isSelected) {
      const alreadySelected = selectedPMs.find((p) =>
        areStringsSimilar(p.name, tagName)
      );
      if (alreadySelected) return false;

      const newPM = unSelectedPaymentMethods.value.find((p) =>
        areStringsSimilar(p.name, tagName)
      ) || {
        ...store.paymentMethods.newValue,
        name: tagName,
        type: vault?.value as CurrencyType,
      };
      onChange({ paymentMethods: [...selectedPMs, newPM] });
    } else {
      onChange({
        paymentMethods: selectedPMs.filter(
          (p) => !areStringsSimilar(p.name, tagName)
        ),
      });
    }
    return true;
  };

  const onAccountSave = () => {
    onSave();
    if (!editableItemTitle.value && initialAccBalance.value) {
      const title = "Set initial balance";
      const initialBalanceUpdateTags = store.tags.filter((tag) =>
        ["balanceupdate", "initialbalance"].includes(unstructuredValue(tag))
      );
      const tags =
        initialBalanceUpdateTags.length === 2
          ? initialBalanceUpdateTags
          : [
              newUnstructuredRecord("balanceupdate"),
              newUnstructuredRecord("initialbalance"),
            ];
      store.txns.save({
        ...store.txns.newValue,
        type: "balance update",
        payments: [
          {
            id: 0,
            amount: initialAccBalance.value,
            account: editingAccount.value,
          },
        ],
        tags: tags,
        title:
          store.titles.find((tt) => unstructuredValue(tt) === title) ||
          newUnstructuredRecord(title),
      });
    }
  };

  return {
    onPageMount,
    initialAccBalance,
    unSelectedPaymentMethods,
    editableItemTitle,
    accountTypeLabel,
    itemProps,
    error,
    onChange,
    onMethodSelectionChange,
    onFormValidate,
    onAccountSave,
  } as const;
};
