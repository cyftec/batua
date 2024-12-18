import { m, type Component } from "@maya/core";
import { dprops, dstr, effect, val, type Signal } from "@maya/signal";
import { type TransactionUI } from "../../@libs/common";
import { DateTimePicker, Dialog, TextBox } from "../../@libs/ui-kit";
import { TagsSelector } from "./tags-selector";

type TransactionEditor = {
  isOpen: boolean;
  editableTransaction: Signal<TransactionUI>;
  onChange: (transaction: TransactionUI) => void;
  onCancel: () => void;
  onSave: () => void;
  error: Signal<string>;
};

export const TransactionEditor: Component<TransactionEditor> = ({
  isOpen,
  editableTransaction,
  onChange,
  onCancel,
  onSave,
  error,
}) => {
  const { title, date, payments, tags } = dprops(editableTransaction);

  return Dialog({
    isOpen: isOpen,
    onTapOutside: onCancel,
    header: val(editableTransaction)
      ? "Edit transaction"
      : "Add new transaction",
    prevLabel: "Cancel",
    nextLabel: "Save",
    onPrev: onCancel,
    onNext: onSave,
    child: m.Div({
      children: [
        DateTimePicker({
          classNames: "mb3",
          dateTime: date,
          onchange: (newDate: Date) =>
            onChange({
              ...editableTransaction.value,
              date: newDate,
            }),
        }),
        TextBox({
          classNames: "mb3 w-100 ph3 pv2 db br3 bw1 ba b--light-gray",
          placeholder: "title",
          text: title,
          onchange: (val) =>
            onChange({
              ...editableTransaction.value,
              title: val,
            }),
        }),
        TagsSelector({
          classNames: "w-100 ph2 pt2 db br3 bw1 ba b--light-gray",
          placeholder: "add tags",
          selectedTags: tags,
          onSelectionChange: (newTags) =>
            onChange({
              ...editableTransaction.value,
              tags: newTags,
            }),
        }),
        // Payments({
        //   classNames: "mt3",
        //   payments: payments,
        //   onchange: (payments) =>
        //     onChange({
        //       ...editableTransaction.value,
        //       payments,
        //     }),
        // }),
        m.Div({
          class: dstr`red ${() => (error.value ? "pt3" : "")}`,
          children: dstr`${() => error.value ?? ""}`,
        }),
      ],
    }),
  });
};
