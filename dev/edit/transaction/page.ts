import { derive, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { db } from "../../@libs/common/localstorage/stores";
import {
  AccountUI,
  Payment,
  TagUI,
  Txn,
  TXN_NECESSITIES_WITH_ICONS,
  TxnType,
  TxnUI,
} from "../../@libs/common/models/core";
import { isFutureDate } from "../../@libs/common/transforms";
import {
  getLowercaseTagName,
  getQueryParamValue,
  nameRegex,
} from "../../@libs/common/utils";
import { HTMLPage, NavScaffold } from "../../@libs/components";
import {
  DateTimePicker,
  DialogActionButtons,
  Icon,
  Label,
  TabbedSelect,
  TextBox,
} from "../../@libs/elements";
import {
  getPrimitiveRecordValue,
  ID_KEY,
  TableRecordID,
} from "../../@libs/kvdb";
import { TagsSelector } from "../@components";
import { PaymentsEditor } from "./@components/PaymentsEditor";

const now = new Date();
const error = signal("");
const txnType = signal<TxnType>("spent");
const txnDate = signal<Date>(now);
const txnCreated = signal<Date>(now);
const txnModified = signal<Date>(now);
const txnNecessity = signal<Txn["necessity"]>("Essential");
const selectedNecessityOptionIndex = derive(() =>
  TXN_NECESSITIES_WITH_ICONS.findIndex(
    (ness) => ness.label === txnNecessity.value
  )
);
const allAccounts = signal<AccountUI[]>([]);
const txnPayments = signal<Payment[]>([]);
const txnTitle = signal<string>("");

const allTags = signal<(TagUI & { isSelected: boolean })[]>([]);
const [selectedTags, nonSelectedTags] = trap(allTags).partition(
  (t) => t.isSelected
);

const editableTxn = signal<TxnUI | undefined>(undefined);
const headerLabel = derive(() =>
  editableTxn.value
    ? `Edit '${getPrimitiveRecordValue(editableTxn.value.title)}'`
    : `Add new transaction`
);
const commitBtnLabel = op(editableTxn).ternary("Save", "Add");

const resetError = () => (error.value = "");

const onTxnNecessityChange = (optionIndex: number) => {
  resetError();
  txnNecessity.value = TXN_NECESSITIES_WITH_ICONS[optionIndex].label;
};

const onTxnDateChange = (newDate: Date) => {
  resetError();
  txnDate.value = newDate;
};

const onTxnTitleChange = (newTitle: string) => {
  resetError();
  txnTitle.value = newTitle.trim();
};

const onNewPeopleAccountAdd = () => {
  console.log(`Adding new Friend`);
  allAccounts.value = db.accounts
    .getAll()
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
    const tagFound = getPrimitiveRecordValue(t) === tagName;
    if (tagFound) {
      existing = true;
      unselected = !t.isSelected;
      t.isSelected = unselected ? true : t.isSelected;
    }
    return t;
  });

  if (existing) {
    if (unselected) allTags.value = updatedAllTags;
    else return false;
  } else {
    const newTagID = db.tags.add(tagName);
    const newTag = db.tags.get(newTagID);
    if (!newTag) throw `Error fetching the new tag after adding it to the DB.`;
    allTags.value = [...allTags.value, { ...newTag, isSelected: true }];
  }

  return true;
};

const validateForm = () => {
  if (!txnTitle.value) {
    error.value = "Name is empty.";
    return;
  }
  if (!nameRegex.test(txnTitle.value)) {
    error.value = "Invalid method name.";
    return;
  }
  if (isFutureDate(txnDate.value)) {
    error.value = "Transaction date cannot be in future.";
    return;
  }
  const sumOfAllPmts = txnPayments.value.reduce((s, p) => s + p.amount, 0);
  if (sumOfAllPmts !== 0) {
    error.value = `The sum of all payment amounts is ${sumOfAllPmts}. It must be 0.`;
    return;
  }
  if (!selectedTags.value.length) {
    error.value = `You must select at least one tag.`;
    return;
  }
  error.value = "";
};

const discardAndGoBack = () => {
  history.back();
};

const saveTxn = () => {
  validateForm();
  if (error.value) return;
  const now = new Date().getTime();
  // const uniqueIdObj = txnUniqueID.value ? { uniqueId: txnUniqueID.value } : {};

  if (editableTxn.value) {
    // txnsStore.update({
    //   ...editableTxn.value,
    //   name: txnTitle.value,
    //   mode: txnMode.value,
    //   ...uniqueIdObj,
    // });
  } else {
    const newTxnTitleID = db.txnTitles.add(txnTitle.value);
    const pmtIDs: TableRecordID[] = [];
    txnPayments.value.forEach((pmt) => {
      const newPmtID = db.payments.add(pmt);
      pmtIDs.push(newPmtID);
    });
    db.txns.add({
      type: "spent",
      date: txnDate.value.getTime(),
      created: now,
      modified: now,
      necessity: txnNecessity.value,
      payments: pmtIDs,
      tags: selectedTags.value.map((tg) => tg[ID_KEY]),
      title: newTxnTitleID,
    });
  }
  history.back();
};

const populateInitialTxnValueOnMount = () => {
  const txnIDStr = getQueryParamValue("id");
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
  txnNecessity.value = editableTxn.value.necessity;
  txnPayments.value = editableTxn.value.payments.map((p) => ({
    amount: p.amount,
    account: p.account.id,
    via: p.via?.id,
  }));
  txnTitle.value = getPrimitiveRecordValue(editableTxn.value.title);
  const editableTxnTagNames = editableTxn.value.tags.map(
    getPrimitiveRecordValue
  );
  allTags.value = allTags.value.map((t) => ({
    ...t,
    isSelected: editableTxnTagNames.includes(getPrimitiveRecordValue(t)),
  }));
};

const onPageMount = () => {
  allTags.value = db.tags
    .getAll()
    .map((t) => ({ ...t, isSelected: false }))
    .sort((a, b) =>
      getPrimitiveRecordValue(a).localeCompare(getPrimitiveRecordValue(b))
    );
  allAccounts.value = db.accounts
    .getAll()
    .sort((a, b) => a.type.localeCompare(b.type));
  populateInitialTxnValueOnMount();
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: headerLabel,
    content: m.Div({
      children: [
        Label({ text: "Necessity of transaction" }),
        TabbedSelect({
          cssClasses: "ml3 mr2 mt2 mb3 pb2",
          labelPosition: "bottom",
          options: TXN_NECESSITIES_WITH_ICONS,
          selectedOptionIndex: selectedNecessityOptionIndex,
          onChange: onTxnNecessityChange,
        }),
        Label({ text: "Time of transaction" }),
        DateTimePicker({
          cssClasses: `w-100 f6 ph3 pv3 mb4 ba br4 b--light-silver bw1`,
          dateTime: txnDate,
          onchange: onTxnDateChange,
        }),
        Label({ text: "Title of transaction" }),
        TextBox({
          cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 mb3 outline-0 w-100`,
          text: txnTitle,
          placeholder: "Title",
          onchange: onTxnTitleChange,
        }),
        Label({ unpadded: true, text: "Payments" }),
        PaymentsEditor({
          payments: txnPayments,
          allAccounts,
          onPaymentAdd,
          onPaymentUpdate,
          onPaymentDelete,
          onNewPeopleAccountAdd,
        }),
        Label({ text: "Associated tags" }),
        TagsSelector({
          onTagTap: onTagTap,
          onAdd: onTagAdd,
          textboxPlaceholder: "search or create new tag",
          selectedTags: trap(selectedTags).map(getPrimitiveRecordValue),
          unSelectedTags: trap(nonSelectedTags).map(getPrimitiveRecordValue),
        }),
      ],
    }),
    hideNavbar: true,
    navbarTop: DialogActionButtons({
      onDiscard: discardAndGoBack,
      onCommit: saveTxn,
      cssClasses: "sticky bottom-0 bg-near-white pv2 ph3 nl3 nr3",
      error: error,
      discardLabel: [
        Icon({ cssClasses: "nl2 mr2", iconName: "arrow_back" }),
        "Cancel",
      ],
      commitLabel: [
        Icon({ cssClasses: "nl3 mr2", iconName: commitBtnLabel }),
        commitBtnLabel,
      ],
    }),
  }),
});
