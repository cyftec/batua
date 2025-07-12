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
import { getQueryParamValue, nameRegex } from "../../@libs/common/utils";
import { HTMLPage, NavScaffold, Tag } from "../../@libs/components";
import {
  DateTimePicker,
  DialogActionButtons,
  Icon,
  Label,
  Link,
  TabbedSelect,
  TextBox,
} from "../../@libs/elements";
import {
  ID_KEY,
  PLAIN_EXTENDED_RECORD_VALUE_KEY,
  TableRecordID,
} from "../../@libs/kvdb";
import { PaymentTile } from "./@components/PaymentTile";
import { isFutureDate } from "../../@libs/common/transforms";

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

const allTags = signal<TagUI[]>([]);
const selectedTags = signal<TagUI[]>([]);
const nonSelectedTags = derive(() => {
  const selectedTagNames = selectedTags.value.map(
    (tg) => tg[PLAIN_EXTENDED_RECORD_VALUE_KEY]
  );
  return allTags.value
    .filter(
      (tg) => !selectedTagNames.includes(tg[PLAIN_EXTENDED_RECORD_VALUE_KEY])
    )
    .sort(
      (a, b) =>
        (b[PLAIN_EXTENDED_RECORD_VALUE_KEY] as any) -
        (a[PLAIN_EXTENDED_RECORD_VALUE_KEY] as any)
    );
});

const editableTxn = signal<TxnUI | undefined>(undefined);
const headerLabel = derive(() =>
  editableTxn.value
    ? `Edit '${editableTxn.value.title[PLAIN_EXTENDED_RECORD_VALUE_KEY]}'`
    : `Add new transaction`
);
const commitBtnLabel = op(editableTxn).ternary("Save", "Add");

const resetError = () => {
  error.value = "";
};

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

const onPaymentAdd = () => {
  resetError();
  txnPayments.value = [
    ...txnPayments.value,
    {
      amount: 0,
      account: allAccounts.value[0].id,
    },
  ];
};

const onPaymentUpdate = (newPayment: Payment, paymentIndex: number) => {
  resetError();
  txnPayments.value = txnPayments.value.map((tp, i) => {
    return paymentIndex === i ? newPayment : tp;
  });
};

const onPaymentRemove = (paymentIndex: number) => {
  resetError();
  txnPayments.value = txnPayments.value.filter((_, i) => i !== paymentIndex);
};

const onTagTap = (tagID: TableRecordID, selectTag: boolean) => {
  resetError();
  const updatedSelectedTags = [...selectedTags.value];
  if (selectTag) {
    const selectedTag = allTags.value.find((tg) => tg.id === tagID) as TagUI;
    updatedSelectedTags.push(selectedTag);
  } else {
    const i = updatedSelectedTags.findIndex((tg) => tg.id === tagID);
    if (i < 0) throw `Tag not found in selected methods list for id - ${tagID}`;
    updatedSelectedTags.splice(i, 1);
  }
  selectedTags.value = updatedSelectedTags;
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
  selectedTags.value = editableTxn.value.tags;
  txnTitle.value = editableTxn.value.title[PLAIN_EXTENDED_RECORD_VALUE_KEY];
};

const onPageMount = () => {
  allTags.value = db.tags.getAll();
  allAccounts.value = db.accounts.getAll();
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
          cssClasses: `w-100 f6 ph3 pv3 mb4 ba br4 b--light-gray`,
          dateTime: txnDate,
          onchange: onTxnDateChange,
        }),
        Label({ text: "Title of transaction" }),
        TextBox({
          cssClasses: `fw5 ba b--light-gray bw1 br4 pa3 mb3 outline-0 w-100`,
          text: txnTitle,
          placeholder: "Title",
          onchange: onTxnTitleChange,
        }),
        Label({ unpadded: true, text: "Payments" }),
        m.Div({
          class: "mb4",
          children: m.For({
            subject: txnPayments,
            n: Infinity,
            nthChild: m.Div({
              class: "mb2 flex items-center justify-end",
              children: Link({
                onClick: onPaymentAdd,
                cssClasses: "f6 mt2",
                children: "Add new payment",
              }),
            }),
            map: (payment, index) =>
              PaymentTile({
                allAccounts: allAccounts,
                payment: payment,
                onChange: (newPmt) => onPaymentUpdate(newPmt, index),
                onRemove: () => onPaymentRemove(index),
              }),
          }),
        }),
        Label({ text: "Associated tags" }),
        m.Div({
          children: [
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: selectedTags,
                map: (tg) =>
                  Tag({
                    onClick: () => onTagTap(tg.id, false),
                    cssClasses: "mr2 mt2",
                    size: "medium",
                    state: "selected",
                    children: tg[PLAIN_EXTENDED_RECORD_VALUE_KEY],
                  }),
              }),
            }),
            m.If({
              subject: trap(nonSelectedTags).length,
              isTruthy: () =>
                m.Div({
                  class: "mt2 pt2 f7 silver",
                  children: "TAP TO SELECT METHODS FROM BELOW",
                }),
            }),
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: nonSelectedTags,
                map: (tg) =>
                  Tag({
                    onClick: () => onTagTap(tg.id, true),
                    cssClasses: "mr2 mt2",
                    size: "medium",
                    state: "unselected",
                    children: tg[PLAIN_EXTENDED_RECORD_VALUE_KEY],
                  }),
              }),
            }),
          ],
        }),
      ],
    }),
    hideNavbar: true,
    navbarTop: DialogActionButtons({
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
      onDiscard: discardAndGoBack,
      onCommit: saveTxn,
    }),
  }),
});
