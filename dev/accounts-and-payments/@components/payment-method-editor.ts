import { m, component } from "@mufw/maya";
import { Dialog } from "../../@libs/elements";
import type { PaymentMethod } from "../../@libs/common";

type PaymentMethodEditorProps = {
  classNames?: string;
  isOpen: boolean;
  dialogTitle: string;
  editingService: PaymentMethod;
  onChange: (paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
  onSave: () => void;
};

export const PaymentMethodEditor = component<PaymentMethodEditorProps>(
  ({
    classNames,
    isOpen,
    dialogTitle,
    editingService,
    onChange,
    onCancel,
    onSave,
  }) => {
    return Dialog({
      isOpen: isOpen,
      header: dialogTitle,
      prevLabel: "Cancel",
      nextLabel: "Save",
      onPrev: onCancel,
      onNext: onSave,
      child: m.Div({
        class: classNames,
        children: "",
      }),
    });
  }
);
