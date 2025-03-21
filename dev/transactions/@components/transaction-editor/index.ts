import { derived, dprops, dstring, effect, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  getDiffDaysFromToday,
  ID,
  TagUI,
  TransactionType,
  type TransactionUI,
} from "../../../@libs/common";
import {
  DateTimePicker,
  Dialog,
  FormField,
  TextBox,
} from "../../../@libs/elements";
import {
  getDefaultNewPayment,
  getDefaultNewPayments,
} from "../../../@libs/stores/payments";
import {
  addTransaction,
  updateTransaction,
} from "../../../@libs/stores/transactions";
import { PaymentsEditor } from "./payments-editor";
import { TagsSelector } from "./tags-selector";

type TransactionEditor = {
  isOpen: boolean;
  editableTransaction?: TransactionUI;
  onChange?: (transaction: TransactionUI) => void;
  onCancel: () => void;
  onDone?: () => void;
};

export const TransactionEditor = component<TransactionEditor>(
  ({ isOpen, editableTransaction, onCancel, onDone }) => {
    const error = signal("");
    const newTransaction = (id: ID): TransactionUI => ({
      id: id,
      type: "spent",
      date: new Date(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      title: "",
      tags: [],
      payments: getDefaultNewPayments(),
    });
    const editedTransaction = signal(
      editableTransaction?.value || newTransaction(crypto.randomUUID())
    );
    const {
      title,
      date,
      payments,
      type: transactionType,
      tags,
    } = dprops(editedTransaction);

    const onTagSelectionChange = (selectedTags: TagUI[]) => {
      editedTransaction.value = {
        ...editedTransaction.value,
        tags: selectedTags,
      };
    };

    const validateTransaction = () => {
      error.value = "";

      if (getDiffDaysFromToday(editedTransaction.value.date).isFuture) {
        error.value = "Date of transaction is in future.";
        return;
      }

      if (!editedTransaction.value.title) {
        error.value = "Title is empty.";
        return;
      }

      if (!editedTransaction.value.tags.length) {
        error.value = "Tags are not added.";
        return;
      }

      if (editedTransaction.value.payments.some((p) => p.amount === 0)) {
        error.value = "Paid amount is 0 in payments section.";
        return;
      }

      if (
        editedTransaction.value.payments.some((p, i) =>
          editedTransaction.value.payments.some(
            (pmt, idx) =>
              i !== idx &&
              p.paymentMethod.id === pmt.paymentMethod.id &&
              p.paymentMethod.account.id === pmt.paymentMethod.account.id
          )
        )
      ) {
        error.value = "Duplicate pair of account and payment service.";
        return;
      }

      console.log("NO ERROR FOUND");
    };

    const saveTransaction = async () => {
      validateTransaction();
      if (error.value) return;

      if (editableTransaction?.value) {
        updateTransaction(editedTransaction.value);
      } else {
        addTransaction(editedTransaction.value);
      }
      resetEditing();
      onDone && onDone();
    };

    const resetEditing = () => {
      error.value = "";
      editedTransaction.value = newTransaction(crypto.randomUUID());
      onCancel();
    };

    effect(() => {
      if (isOpen.value && !editableTransaction?.value) {
        editedTransaction.value = newTransaction(crypto.randomUUID());
      }
    });

    effect(() => {
      if (editableTransaction?.value) {
        editedTransaction.value = editableTransaction.value;
      }
    });

    return Dialog({
      classNames: "w-50",
      isOpen: isOpen,
      header: derived(() =>
        editableTransaction?.value
          ? `Edit '${
              editableTransaction.value.title
            }' from ${editableTransaction.value.date.toLocaleDateString()}`
          : "Add new transaction"
      ),
      prevLabel: "Cancel",
      nextLabel: derived(() => (editableTransaction?.value ? "Update" : "Add")),
      onTapOutside: resetEditing,
      onPrev: resetEditing,
      onNext: saveTransaction,
      child: m.Div({
        children: [
          FormField({
            label: "Time of transaction",
            children: DateTimePicker({
              classNames: "mb3",
              dateTime: date,
              onchange: (newDate: Date) =>
                (editedTransaction.value = {
                  ...editedTransaction.value,
                  date: newDate,
                }),
            }),
          }),
          FormField({
            label: "Transaction title",
            children: TextBox({
              classNames: "mb3 w-100 ph2 pv2 db br3 bw1 ba b--light-gray",
              placeholder: "title",
              text: title,
              onchange: (val) =>
                (editedTransaction.value = {
                  ...editedTransaction.value,
                  title: val,
                }),
            }),
          }),
          FormField({
            label: "Associated tags",
            children: TagsSelector({
              classNames: "mb3 w-100 ph2 pt2 db br3 bw1 ba b--light-gray",
              placeholder: "add tag",
              selectedTags: tags,
              onSelectionChange: onTagSelectionChange,
            }),
          }),
          FormField({
            label: "Payments",
            children: PaymentsEditor({
              classNames: "w-100 ph2 pt2 db br3 bw1 ba b--light-gray",
              payments: payments,
              transactionType: transactionType,
              onPaymentsChange: (payments) =>
                (editedTransaction.value = {
                  ...editedTransaction.value,
                  payments,
                }),
              onTransactionTypeChange: (txnType) =>
                (editedTransaction.value = {
                  ...editedTransaction.value,
                  type: txnType as TransactionType,
                }),
            }),
          }),
          m.Div({
            class: dstring`red ${() => (error.value ? "pt3" : "")}`,
            children: error,
          }),
        ],
      }),
    });
  }
);
