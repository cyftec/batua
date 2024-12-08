import { Component, m } from "@maya/core";
import { dprops, dstr, source, val } from "@maya/signal";
import { getDiffDaysFromToday, Payment, Transaction } from "../../@libs/common";
import {
  Button,
  DateTimePicker,
  Dialog,
  Modal,
  TextBox,
} from "../../@libs/ui-kit";
import { Payments } from "./payments";
import { TagsSelector } from "./tags-selector";

type TransactionEditor = {
  isOpen: boolean;
  editableTransaction?: Transaction;
  onCancel: () => void;
  onSave: (transaction: Transaction) => void;
};

export const TransactionEditor: Component<TransactionEditor> = ({
  isOpen,
  editableTransaction,
  onCancel,
  onSave,
}) => {
  const error = source<string | null>(null);
  const initPayment: Payment = {
    amount: 0,
    currencyCode: "INR",
    paymentMethodCode: "CASH",
  };
  const initTransaction: Transaction = {
    title: "",
    date: new Date(),
    modifiedDate: new Date(),
    tags: [],
    payments: [initPayment],
  };
  const transaction = source(initTransaction);
  const { title, date, tags, payments } = dprops(transaction);

  const resetTransaction = () => {
    error.value = null;
    transaction.value = initTransaction;
  };

  const validateTransaction = () => {
    error.value = null;

    if (getDiffDaysFromToday(date.value).isFuture) {
      error.value = "Date of transaction is in future.";
      return;
    }

    if (!transaction.value.title) {
      error.value = "Title is empty.";
      return;
    }

    if (!transaction.value.tags.length) {
      error.value = "Tags are not added.";
      return;
    }

    if (transaction.value.payments.some((p) => p.amount === 0)) {
      error.value = "Paid amount is 0 in payments section.";
      return;
    }

    if (
      transaction.value.payments.some((p, i) =>
        transaction.value.payments.some(
          (pm, idx) => i !== idx && p.paymentMethodCode === pm.paymentMethodCode
        )
      )
    ) {
      error.value = "Duplicate payment methods in payments section.";
      return;
    }

    console.log("NO ERROR FOUND");
  };

  const cancelEditing = () => {
    resetTransaction();
    onCancel();
  };

  const submitTransaction = () => {
    validateTransaction();
    if (error.value) return;

    onSave(transaction.value);
    resetTransaction();
  };

  return Dialog({
    isOpen: isOpen,
    onTapOutside: cancelEditing,
    header: val(editableTransaction)
      ? "Edit transaction"
      : "Add new transaction",
    prevLabel: "Cancel",
    nextLabel: "Save",
    onPrev: cancelEditing,
    onNext: submitTransaction,
    child: m.Div([
      DateTimePicker({
        classNames: "mb3",
        dateTime: date,
        onchange: (newDate: Date) => {
          transaction.value = {
            ...transaction.value,
            date: newDate,
          };
        },
      }),
      TextBox({
        classNames: "mb3 w-100 ph3 pv2 db br3 bw1 ba b--light-gray",
        placeholder: "title",
        text: title,
        onchange: (val) => {
          transaction.value = {
            ...transaction.value,
            title: val,
          };
        },
      }),
      TagsSelector({
        classNames: "w-100 ph2 pt2 db br3 bw1 ba b--light-gray",
        placeholder: "add tags",
        selectedTags: tags,
        onSelectionChange: (newTags) => {
          transaction.value = {
            ...transaction.value,
            tags: newTags,
          };
        },
      }),
      Payments({
        classNames: "mt3",
        payments: payments,
        onadd: () => {
          transaction.value = {
            ...transaction.value,
            payments: [...transaction.value.payments, initPayment],
          };
        },
        onremove: (paymentIndex) => {
          transaction.value = {
            ...transaction.value,
            payments: transaction.value.payments.filter(
              (_, index) => paymentIndex !== index
            ),
          };
        },
        onchange: (payments) => {
          transaction.value = {
            ...transaction.value,
            payments,
          };
        },
      }),
      m.Div({
        class: dstr`red ${() => (error.value ? "pt3" : "")}`,
        children: dstr`${() => error.value ?? ""}`,
      }),
    ]),
  });
};
