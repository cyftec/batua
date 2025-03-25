import {
  compute,
  derived,
  dprops,
  dstring,
  effect,
  MaybeSignalObject,
  signal,
} from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import type { AccountUI, ID, PaymentServiceUI } from "../../@libs/common";
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
  addPaymentService,
  editPaymentService,
} from "../../@libs/stores/payment-services";

type PaymentServiceEditorProps = {
  classNames?: string;
  isOpen: boolean;
  dialogTitle: string;
  editablePaymentService?: PaymentServiceUI;
  onDone: () => void;
  onCancel: () => void;
};

export const PaymentServiceEditor = component<PaymentServiceEditorProps>(
  ({
    classNames,
    isOpen,
    dialogTitle,
    editablePaymentService,
    onDone,
    onCancel,
  }) => {
    const error = signal("");
    const initPaymentService = (id: ID): PaymentServiceUI => ({
      id: id,
      name: "",
      uniqueId: undefined,
      accounts: [],
    });
    const editedPaymentService = signal(
      editablePaymentService?.value || initPaymentService(crypto.randomUUID())
    );
    const { name, uniqueId, accounts } = dprops(editedPaymentService);

    const validateEditingPaymentService = () => {
      if (
        editablePaymentService?.value &&
        areValuesEqual(
          editablePaymentService?.value,
          editedPaymentService.value
        )
      ) {
        error.value = "No change in original payment service";
        return;
      }

      if (!editedPaymentService.value.name) {
        error.value = "Name should not be empty";
        return;
      }

      if (!editedPaymentService.value.accounts.length) {
        error.value = "At least one connected account should be selected";
        return;
      }
    };

    const onNameChange = (text: string) => {
      error.value = "";
      editedPaymentService.value = {
        ...editedPaymentService.value,
        name: text.trim(),
      };
    };

    const onUniqueIdChange = (text: string) => {
      error.value = "";
      editedPaymentService.value = {
        ...editedPaymentService.value,
        uniqueId: text.trim() || undefined,
      };
    };

    const toggleAccountSelection = (account: MaybeSignalObject<AccountUI>) => {
      error.value = "";
      const updatedAccounts = editedPaymentService.value.accounts.filter(
        (pmAcc) => pmAcc.id !== account.value.id
      );
      const isAddition =
        updatedAccounts.length === editedPaymentService.value.accounts.length;
      editedPaymentService.value = {
        ...editedPaymentService.value,
        accounts: isAddition
          ? [...updatedAccounts, account.value]
          : updatedAccounts,
      };
    };

    const onUpdate = () => {
      validateEditingPaymentService();
      if (error.value) return;

      if (editablePaymentService?.value) {
        editPaymentService(editedPaymentService.value);
      } else {
        addPaymentService(editedPaymentService.value);
      }
      onDone();
    };

    const onCancelEditing = () => {
      error.value = "";
      onCancel();
    };

    effect(() => {
      const editable = editablePaymentService?.value;
      if (isOpen.value) {
        editedPaymentService.value =
          editable || initPaymentService(crypto.randomUUID());
      }
    });

    return Dialog({
      classNames: "mw-35",
      isOpen: isOpen,
      header: dialogTitle,
      prevLabel: "Cancel",
      nextLabel: derived(() =>
        editablePaymentService?.value ? "Update" : "Add"
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
              text: name,
              onchange: onNameChange,
            }),
          }),
          FormField({
            classNames: "mb3",
            label: "Unique ID",
            children: TextBox({
              classNames: "w-100 br2 ba bw1 b--light-gray pa2",
              placeholder: "(optional) unique ID",
              text: dstring`${uniqueId}`,
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
                    accounts.value.some((pmAcc) => pmAcc.id === acc.value.id)
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
