import { derive, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "../../../../state/localstorage/stores";
import {
  AccountUI,
  Payment,
  TagUI,
  Txn,
  TxnSubType,
  // TXN_NECESSITIES_WITH_ICONS,
  TxnType,
  TxnUI,
} from "../../../../models/core";
import { isFutureDate } from "../../../../state/transforms";
import { getLowercaseTagName, nameRegex } from "../../../../state/utils";
import { DateTimePicker, Label, Section, TextBox } from "../../../elements";
import {
  primitiveValue,
  ID_KEY,
  PLAIN_EXTENDED_RECORD_VALUE_KEY,
  TableRecordID,
} from "../../../../_kvdb";
import { EditPage, TagsSelector } from "../@components";
import { PaymentsEditor } from "./@components";
import { TransactionTypeSelector } from "./@components/TransactionTypeSelector";

const now = new Date();
const error = signal("");
const txnType = signal<TxnType>("expense");
const txnSubType = signal<TxnSubType>("purchase");
const txnDate = signal<Date>(now);
const txnCreated = signal<Date>(now);
const txnModified = signal<Date>(now);
const allAccounts = signal<AccountUI[]>([]);
const txnPayments = signal<Payment[]>([]);
const txnTitle = signal<string>("");

const allTags = signal<(TagUI & { isSelected: boolean })[]>([]);
const [selectedTags, nonSelectedTags] = trap(allTags).partition(
  (t) => t.isSelected
);

const editableTxn = signal<TxnUI | undefined>(undefined);
const editableTxnName = derive(
  () => editableTxn.value?.title?.[PLAIN_EXTENDED_RECORD_VALUE_KEY] || ""
);

const onPageMount = (urlParams: URLSearchParams) => {
  allTags.value = db.tags
    .get([])
    .map((t) => ({ ...t, isSelected: false }))
    .sort((a, b) => primitiveValue(a).localeCompare(primitiveValue(b)));
  allAccounts.value = db.accounts
    .get([])
    .sort((a, b) => a.type.localeCompare(b.type));
  const txnIDStr = urlParams.get("id");
  if (!txnIDStr) {
    txnPayments.value = [
      {
        amount: -100,
        account: allAccounts.value[1].id,
      },
      {
        amount: 100,
        account: allAccounts.value[0].id,
      },
    ];
    return;
  }

  const txnID: TableRecordID = +txnIDStr;
  const txn = db.txns.get(txnID);
  if (!txn) throw `Error fetching transaction for id - ${txnID}`;
  editableTxn.value = txn;
  txnType.value = editableTxn.value.type;
  txnDate.value = editableTxn.value.date;
  txnCreated.value = editableTxn.value.created;
  txnModified.value = editableTxn.value.modified;
  txnPayments.value = editableTxn.value.payments.map((p) => ({
    amount: p.amount,
    account: p.account.id,
    via: p.via?.id,
  }));
  txnTitle.value = primitiveValue(editableTxn.value.title);
  const editableTxnTagNames = editableTxn.value.tags.map(primitiveValue);
  allTags.value = allTags.value.map((t) => ({
    ...t,
    isSelected: editableTxnTagNames.includes(primitiveValue(t)),
  }));
};

const resetError = () => (error.value = "");

// const onTxnNecessityChange = (optionIndex: number) => {
//   resetError();
//   txnNecessity.value = TXN_NECESSITIES_WITH_ICONS[optionIndex].label;
// };

const onTxnDateChange = (newDate: Date) => {
  resetError();
  txnDate.value = newDate;
};

const onTxnTitleChange = (newTitle: string) => {
  resetError();
  txnTitle.value = newTitle.trim();
};

const onNewPeopleAccountAdd = () => {
  resetError();
  console.log(`Adding new Friend`);
  allAccounts.value = db.accounts
    .get([])
    .sort((a, b) => a.type.localeCompare(b.type));
};

const onPaymentAdd = () => {
  resetError();
  const oldPayments = txnPayments.value;
  const sum = oldPayments.reduce((s, p) => s + p.amount, 0);
  txnPayments.value = [
    ...oldPayments,
    {
      amount: sum === 0 ? 0 : -sum,
      account: allAccounts.value[0].id,
    },
  ];
};

const onPaymentUpdate = (newPayment: Payment, paymentIndex: number) => {
  resetError();
  const payments = txnPayments.value;
  const oldPayment = payments[paymentIndex];
  const diff = newPayment.amount - oldPayment.amount;
  let compensatingPaymentIndex = -1;

  if (diff !== 0) {
    compensatingPaymentIndex = payments.findIndex((p, i) => {
      return oldPayment.amount < 0
        ? p.amount < 0 && i !== paymentIndex
        : p.amount >= 0;
    });
    if (compensatingPaymentIndex === -1) {
      compensatingPaymentIndex = payments.findIndex((p) => {
        return oldPayment.amount < 0 ? p.amount >= 0 : p.amount < 0;
      });
    }
  }
  const compensatingPayment = payments[compensatingPaymentIndex];
  console.log(compensatingPayment);
  txnPayments.value = txnPayments.value.map((tp, i) =>
    paymentIndex === i
      ? newPayment
      : compensatingPaymentIndex === i
      ? { ...compensatingPayment, amount: compensatingPayment.amount - diff }
      : tp
  );
};

const onPaymentDelete = (paymentIndex: number) => {
  resetError();
  txnPayments.value = txnPayments.value.filter((_, i) => i !== paymentIndex);
};

const onTagTap = (tagIndex: number, isSelected: boolean) => {
  resetError();
  const tappedTag = isSelected
    ? nonSelectedTags.value[tagIndex]
    : selectedTags.value[tagIndex];
  allTags.value = allTags.value.map((t) => {
    if (t[ID_KEY] === tappedTag[ID_KEY]) t.isSelected = isSelected;
    return t;
  });
};

const onTagAdd = (text: string) => {
  resetError();
  const tagName = getLowercaseTagName(text);
  let existing = false;
  let unselected = false;
  const updatedAllTags = allTags.value.map((t) => {
    const tagFound = primitiveValue(t) === tagName;
    if (tagFound) {
      existing = true;
      unselected = !t.isSelected;
      t.isSelected = unselected ? true : t.isSelected;
    }
    return t;
  });

  if (existing) {
    if (unselected) {
      allTags.value = updatedAllTags;
      console.log(tagName, selectedTags.value);
    } else return false;
  } else {
    const newTagID = db.tags.push(tagName);
    const newTag = db.tags.get(newTagID);
    if (!newTag) throw `Error fetching the new tag after adding it to the DB.`;
    allTags.value = [...allTags.value, { ...newTag, isSelected: true }];
  }

  return true;
};

const validateForm = () => {
  let err = "";
  if (!txnTitle.value) err = "Name is empty.";
  if (!nameRegex.test(txnTitle.value)) err = "Invalid method name.";
  if (isFutureDate(txnDate.value))
    err = "Transaction date cannot be in future.";
  const sumOfAllPmts = txnPayments.value.reduce((s, p) => s + p.amount, 0);
  if (sumOfAllPmts !== 0)
    err = `The sum of all payment amounts is ${sumOfAllPmts}. It must be 0.`;
  if (!selectedTags.value.length) err = `You must select at least one tag.`;
  error.value = err;
};

const onTxnSave = () => {
  const now = new Date().getTime();
  // const uniqueIdObj = txnUniqueID.value ? { uniqueId: txnUniqueID.value } : {};

  if (editableTxn.value) {
    // TODO: implement txn update
  } else {
    const newTxnTitleID = db.txnTitles.push(txnTitle.value);
    const pmtIDs: TableRecordID[] = [];
    txnPayments.value.forEach((pmt) => {
      const newPmtID = db.payments.push(pmt);
      pmtIDs.push(newPmtID);
    });
    db.txns.push({
      type: "balance update",
      date: txnDate.value.getTime(),
      created: now,
      modified: now,
      payments: pmtIDs,
      tags: selectedTags.value.map((tg) => tg[ID_KEY]),
      title: newTxnTitleID,
    });
  }
};

export default EditPage({
  error: error,
  editableItemType: "transaction",
  editableItemTitle: editableTxnName,
  onMount: onPageMount,
  validateForm: validateForm,
  onSave: onTxnSave,
  content: m.Div([
    // Label({ text: "Necessity of transaction" }),
    // TabbedSelect({
    //   cssClasses: "ml3 mr2 mt2 mb3 pb2",
    //   labelPosition: "bottom",
    //   options: TXN_NECESSITIES_WITH_ICONS,
    //   selectedOptionIndex: selectedNecessityOptionIndex,
    //   onChange: onTxnNecessityChange,
    // }),
    Section({
      title: "Basic details",
      children: [
        Label({ text: "Transaction type" }),
        TransactionTypeSelector({
          txnType: txnType,
          txnSubType: txnSubType,
          onChange: (type, subtype) => {
            console.log(type, subtype);

            txnType.value = type;
            txnSubType.value = subtype;
          },
        }),
        Label({ text: "Time of transaction" }),
        DateTimePicker({
          cssClasses: `w-100 f6 ba b--light-silver bw1 br3 pa2 mb2`,
          dateTime: txnDate,
          onchange: onTxnDateChange,
        }),
        Label({ text: "Title of transaction" }),
        TextBox({
          cssClasses: `fw5 ba b--light-silver bw1 br3 pa2 mb2 outline-0 w-100`,
          text: txnTitle,
          placeholder: "Title",
          onchange: onTxnTitleChange,
        }),
      ],
    }),
    Section({
      title: "Payments",
      children: PaymentsEditor({
        payments: txnPayments,
        allAccounts,
        onPaymentAdd,
        onPaymentUpdate,
        onPaymentDelete,
        onNewPeopleAccountAdd,
      }),
    }),
    Section({
      title: "Associated tags",
      children: TagsSelector({
        onTagTap: onTagTap,
        onAdd: onTagAdd,
        textboxPlaceholder: "search or create new tag",
        selectedTags: trap(selectedTags).map(primitiveValue),
        unSelectedTags: trap(nonSelectedTags).map(primitiveValue),
      }),
    }),
  ]),
});
