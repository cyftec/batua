import {
  derived,
  dstring,
  effect,
  MaybeSignalObject,
  signal,
} from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import type { AccountUI, ID, PaymentMethodUI } from "../../@libs/common";
import {
  DateTimePicker,
  Dialog,
  FormField,
  Tag,
  TextBox,
} from "../../@libs/elements";
import { allAccounts } from "../../@libs/stores/accounts";
import { areValuesEqual } from "@cyftech/immutjs";
import {
  addPaymentMethod,
  editPaymentMethod,
} from "../../@libs/stores/payment-methods";

type PaymentMethodEditorProps = {
  classNames?: string;
  isOpen: boolean;
  dialogTitle: string;
  editablePaymentMethod?: PaymentMethodUI;
  onDone: () => void;
  onCancel: () => void;
};

export const PaymentMethodEditor = component<PaymentMethodEditorProps>(
  ({
    classNames,
    isOpen,
    dialogTitle,
    editablePaymentMethod,
    onDone,
    onCancel,
  }) => {
    const error = signal("");
    const initPaymentMethod = (id: ID): PaymentMethodUI => ({
      id: id,
      name: "",
      uniqueId: undefined,
      accounts: [],
    });
    const editedPaymentMethod = signal(
      editablePaymentMethod?.value || initPaymentMethod(crypto.randomUUID())
    );
    effect(() => {
      const editable = editablePaymentMethod?.value;
      if (isOpen.value) {
        editedPaymentMethod.value =
          editable || initPaymentMethod(crypto.randomUUID());
      }
    });

    const validateEditingPaymentMethod = () => {
      if (
        editablePaymentMethod?.value &&
        areValuesEqual(editablePaymentMethod?.value, editedPaymentMethod.value)
      ) {
        error.value = "No change in original payment method";
        return;
      }

      if (!editedPaymentMethod.value.name) {
        error.value = "Name should not be empty";
        return;
      }

      if (!editedPaymentMethod.value.accounts.length) {
        error.value = "At least one connected account should be selected";
        return;
      }
    };

    const onNameChange = (text: string) => {
      error.value = "";
      editedPaymentMethod.value = {
        ...editedPaymentMethod.value,
        name: text.trim(),
      };
    };

    const onUniqueIdChange = (text: string) => {
      error.value = "";
      editedPaymentMethod.value = {
        ...editedPaymentMethod.value,
        uniqueId: text.trim() || undefined,
      };
    };

    const toggleAccountSelection = (account: MaybeSignalObject<AccountUI>) => {
      error.value = "";
      const updatedAccounts = editedPaymentMethod.value.accounts.filter(
        (pmAcc) => pmAcc.id !== account.value.id
      );
      const isAddition =
        updatedAccounts.length === editedPaymentMethod.value.accounts.length;
      editedPaymentMethod.value = {
        ...editedPaymentMethod.value,
        accounts: isAddition
          ? [...updatedAccounts, account.value]
          : updatedAccounts,
      };
    };

    const onUpdate = () => {
      validateEditingPaymentMethod();
      if (error.value) return;

      if (editablePaymentMethod?.value) {
        editPaymentMethod(editedPaymentMethod.value);
      } else {
        addPaymentMethod(editedPaymentMethod.value);
      }
      onDone();
    };

    const onCancelEditing = () => {
      error.value = "";
      onCancel();
    };

    return Dialog({
      classNames: "mw-35",
      isOpen: isOpen,
      header: dialogTitle,
      prevLabel: "Cancel",
      nextLabel: derived(() =>
        editablePaymentMethod?.value ? "Update" : "Add"
      ),
      onNext: onUpdate,
      onPrev: onCancelEditing,
      onTapOutside: onCancelEditing,
      child: m.Div({
        class: dstring`w-100 ${classNames}`,
        children: [
          FormField({
            classNames: "mb3",
            label: "Name",
            children: TextBox({
              classNames: "w-100 br2 ba bw1 b--light-gray pa2",
              text: derived(() => editedPaymentMethod.value.name),
              onchange: onNameChange,
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Unique ID",
            children: TextBox({
              classNames: "w-100 br2 ba bw1 b--light-gray pa2",
              placeholder: "(optional) unique ID",
              text: derived(() => editedPaymentMethod.value.uniqueId || ""),
              onchange: onUniqueIdChange,
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Connected Accounts",
            children: m.Div({
              class: "w-100 br2 ba bw1 b--light-gray pl2 pt2 flex flex-wrap",
              children: m.For({
                subject: allAccounts,
                itemKey: "id",
                map: (acc) => {
                  const isSelected = derived(() =>
                    editedPaymentMethod.value.accounts.some(
                      (pmAcc) => pmAcc.id === acc.value.id
                    )
                  );
                  return Tag({
                    classNames: "ph2 pv1 mr2 mb2 pointer",
                    isHighlighted: isSelected,
                    label: acc.value.name,
                    iconClassNames: "ml1",
                    iconSize: 17,
                    iconName: derived(() =>
                      isSelected.value ? "check_box" : "check_box_outline_blank"
                    ),
                    onClick: () => toggleAccountSelection(acc),
                  });
                },
              }),
            }),
          }),
          m.If({
            subject: error,
            isTruthy: m.Span({
              class: "red",
              children: error,
            }),
          }),
        ],
      }),
    });
  }
);
