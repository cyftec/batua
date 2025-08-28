import {
  DbRecordID,
  ID_KEY,
  newUnstructuredRecord,
  UNSTRUCTURED_RECORD_VALUE_KEY,
  unstructuredValue,
} from "@cyftec/kvdb";
import { derive, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "../../../../controllers/state";
import { isFutureDate } from "../../../../controllers/transforms";
import { getLowercaseTagName, nameRegex } from "../../../../controllers/utils";
import {
  Account,
  Payment,
  Tag,
  Txn,
  TxnSubType,
  TxnType,
} from "../../../../models/data-models";
import { DateTimePicker, Label, Section, TextBox } from "../../../elements";
import { EditPage, TagsSelector } from "../@components";
import { PaymentsEditor } from "./@components";
import { TransactionTypeSelector } from "./@components/TransactionTypeSelector";

const error = signal("");
const now = new Date();
const txn = signal<Txn>({
  id: 0,
  date: now,
  created: now,
  modified: now,
  type: "expense",
  payments: [],
  tags: [],
  title: { id: 0, value: "" },
});
const txnType = signal<TxnType>("expense");
const txnSubType = signal<TxnSubType>("purchase");
const txnDate = signal<Date>(now);
const txnCreated = signal<Date>(now);
const txnModified = signal<Date>(now);
const allAccounts = signal<Account[]>([]);
const txnPayments = signal<Payment[]>([]);
const title = signal<string>("");

const allTags = signal<(Tag & { isSelected: boolean })[]>([]);
const [selectedTags, nonSelectedTags] = trap(allTags).partition(
  (t) => t.isSelected
);

const editableTxn = signal<Txn | undefined>(undefined);
const editableTxnName = derive(
  () => editableTxn.value?.title?.[UNSTRUCTURED_RECORD_VALUE_KEY] || ""
);

const onPageMount = (urlParams: URLSearchParams) => {
  allTags.value = db.tags
    .get()
    .map((t) => ({ ...t, isSelected: false }))
    .sort((a, b) => unstructuredValue(a).localeCompare(unstructuredValue(b)));
  allAccounts.value = db.accounts
    .get()
    .sort((a, b) => a.type.localeCompare(b.type));
  const txnIDStr = urlParams.get("id");
  if (!txnIDStr) {
    txnPayments.value = [
      {
        id: 0,
        amount: -100,
        account: allAccounts.value[1],
      },
      {
        id: 0,
        amount: 100,
        account: allAccounts.value[0],
      },
    ];
    return;
  }

  const txnID: DbRecordID = +txnIDStr;
  const txn = db.txns.get(txnID);
  if (!txn) throw `Error fetching transaction for id - ${txnID}`;
  editableTxn.value = txn;
  txnType.value = editableTxn.value.type;
  txnDate.value = editableTxn.value.date;
  txnCreated.value = editableTxn.value.created;
  txnModified.value = editableTxn.value.modified;
  txnPayments.value = editableTxn.value.payments;
  title.value = unstructuredValue(editableTxn.value.title);
  const editableTxnTagNames = editableTxn.value.tags.map(unstructuredValue);
  allTags.value = allTags.value.map((t) => ({
    ...t,
    isSelected: editableTxnTagNames.includes(unstructuredValue(t)),
  }));
};

const resetError = () => (error.value = "");

const onTxnDateChange = (newDate: Date) => {
  resetError();
  txnDate.value = newDate;
};

const onTitleChange = (newTitle: string) => {
  resetError();
  title.value = newTitle.trim();
};

const onNewPeopleAccountAdd = () => {
  resetError();
  console.log(`Adding new Friend`);
  allAccounts.value = db.accounts
    .get()
    .sort((a, b) => a.type.localeCompare(b.type));
};

const onNewPaymentAdd = () => {
  resetError();
  const oldPayments = txnPayments.value;
  const sum = oldPayments.reduce((s, p) => s + p.amount, 0);
  txnPayments.value = [
    ...oldPayments,
    {
      id: 0,
      amount: sum === 0 ? 0 : -sum,
      account: allAccounts.value[0],
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
    const tagFound = unstructuredValue(t) === tagName;
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
    const newTag = db.tags.put(newUnstructuredRecord(tagName));
    allTags.value = [...allTags.value, { ...newTag, isSelected: true }];
  }

  return true;
};

const validateForm = () => {
  let err = "";
  if (!title.value) err = "Name is empty.";
  if (!nameRegex.test(title.value)) err = "Invalid method name.";
  if (isFutureDate(txnDate.value))
    err = "Transaction date cannot be in future.";
  const sumOfAllPmts = txnPayments.value.reduce((s, p) => s + p.amount, 0);
  if (sumOfAllPmts !== 0)
    err = `The sum of all payment amounts is ${sumOfAllPmts}. It must be 0.`;
  if (!selectedTags.value.length) err = `You must select at least one tag.`;
  error.value = err;
};

const onTxnSave = () => {
  const now = new Date();
  // const uniqueIdObj = txnUniqueID.value ? { uniqueId: txnUniqueID.value } : {};

  if (editableTxn.value) {
    // TODO: implement txn update
  } else {
    let existingTitle = db.titles.find(
      (tt) => unstructuredValue(tt) === title.value
    );
    if (!existingTitle)
      existingTitle = db.titles.put(newUnstructuredRecord(title.value));
    const pmts: Payment[] = [];
    txnPayments.value.forEach((pmt) => {
      const newPmt = db.payments.put(pmt);
      pmts.push(newPmt);
    });
    db.txns.put({
      id: 0,
      type: "balance update",
      date: txnDate.value,
      created: now,
      modified: now,
      payments: pmts,
      tags: selectedTags.value,
      title: existingTitle,
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
          text: title,
          placeholder: "Title",
          onchange: onTitleChange,
        }),
      ],
    }),
    Section({
      title: "Payments",
      children: PaymentsEditor({
        payments: txnPayments,
        allAccounts,
        onPaymentAdd: onNewPaymentAdd,
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
        selectedTags: trap(selectedTags).map(unstructuredValue),
        unSelectedTags: trap(nonSelectedTags).map(unstructuredValue),
      }),
    }),
  ]),
});
