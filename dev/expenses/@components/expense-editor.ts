import {
  Component,
  drspread,
  effect,
  m,
  newVal,
  receive,
  signal,
  Signal,
} from "@maya/core";
import { Expense } from "../../@libs/common";
import { Button, DateTimePicker, Modal, TextBox } from "../../@libs/ui-kit";
import { SuggestionBox } from "../../@libs/ui-kit/suggestionbox";
import { Payments } from "./payments";

const wire = (
  obj: Signal<Record<string, any>>,
  prop: string,
  source: Signal<any>
) => {
  const newObjValue = newVal(obj.value);
  effect(() => {
    newObjValue[prop] = source.value;
    obj.value = newObjValue;
  });
};

type ExpenseEditor = {
  isOpen: boolean;
  editableExpense?: Expense;
  onCancel: () => void;
  onSave: (expense: Expense) => void;
};

export const ExpenseEditor = Component<ExpenseEditor>(
  ({ isOpen, editableExpense, onCancel, onSave }) => {
    const unsetExpense = (): Expense => ({
      title: "",
      date: new Date(),
      modifiedDate: new Date(),
      tags: [],
      payments: [
        {
          amount: 0,
          currency: {
            code: "INR",
            name: "India Rupee",
            symbol: "₹",
          },
          method: {
            code: "CASH",
            displayName: "Cash",
          },
        },
      ],
    });
    const expense = signal(unsetExpense());
    if (editableExpense) receive(expense, editableExpense);
    const suggestionBoxText = signal("");
    const suggestions = signal<string[]>([]);
    const { title, date, tags, payments } = drspread(expense);

    const resetExpense = () => (expense.value = unsetExpense());

    const cancelEditing = () => {
      console.log(expense.value);
      resetExpense();
      onCancel();
    };

    const submitExpense = () => {
      onSave(expense.value);
      resetExpense();
    };

    return Modal({
      classNames: "w-60",
      isOpen: isOpen,
      onTapOutside: cancelEditing,
      content: m.Div({
        children: [
          m.H2({
            class: "ma0 pb4",
            children: m.Text(
              editableExpense?.value ? "Edit expense" : "Add new expense"
            ),
          }),
          m.Div({
            children: [
              DateTimePicker({
                classNames: "mb3",
                dateTime: date,
                onchange: (newDate: Date) => {
                  console.log(newDate);
                  expense.value = {
                    ...expense.value,
                    date: newDate,
                  };
                },
              }),
              TextBox({
                classNames: "mb3 w-100 ph3 pv2",
                placeholder: "title",
                text: title,
                onchange: (val) => {
                  expense.value = {
                    ...expense.value,
                    title: val,
                  };
                },
              }),
              SuggestionBox({
                classNames: "mb3 ph3 pv2",
                text: suggestionBoxText,
                suggestions: suggestions,
                onSuggestionSelect: function (suggestionIndex: number): void {
                  throw new Error("Function not implemented.");
                },
                onTextChange: function (value: string): void {
                  throw new Error("Function not implemented.");
                },
              }),
              Payments({
                payments: payments,
                onchange: (payments) => {
                  console.log(payments);
                  expense.value = {
                    ...expense.value,
                    payments,
                  };
                  console.log(expense);
                },
              }),
              m.Div({
                class: "flex items-center justify-between mt4",
                children: [
                  Button({
                    label: "Cancel",
                    onTap: cancelEditing,
                  }),
                  Button({
                    label: "Save",
                    onTap: submitExpense,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  }
);
