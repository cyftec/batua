import { dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import type { PaymentMethodUI } from "../../@libs/common";
import { AddButtonTile, ListTile, SectionTitle } from "../../@libs/components";
import { Icon } from "../../@libs/elements";
import { allPaymentMethods } from "../../@libs/stores/payment-methods";
import { PaymentMethodEditor } from "./payment-method-editor";

type PaymentMethodsProps = {
  classNames?: string;
};

export const PaymentMethods = component<PaymentMethodsProps>(
  ({ classNames }) => {
    const isEditorOpen = signal(false);
    const editablePaymentMethod = signal<PaymentMethodUI | undefined>(
      undefined
    );

    const closeEditor = () => {
      editablePaymentMethod.value = undefined;
      isEditorOpen.value = false;
    };

    return m.Div({
      class: dstring`${classNames}`,
      children: [
        PaymentMethodEditor({
          isOpen: isEditorOpen,
          dialogTitle: dstring`${() =>
            editablePaymentMethod.value
              ? `Edit '${editablePaymentMethod.value.name}'`
              : "Add new"} payment method`,
          editablePaymentMethod: editablePaymentMethod,
          onDone: closeEditor,
          onCancel: closeEditor,
        }),
        SectionTitle({
          iconName: "account_balance_wallet",
          label: "Digital Wallets and Payment Methods",
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: allPaymentMethods,
            n: Infinity,
            nthChild: AddButtonTile({
              classNames: "mr3 mt3 pt4 w-43",
              tooltip: "Add new payment method",
              onClick: () => (isEditorOpen.value = true),
              children: Icon({
                className: "mb2 silver",
                size: 42,
                iconName: "add",
              }),
            }),
            map: (pm) =>
              ListTile({
                classNames: "mr3 mt3 w-43",
                title: pm.name,
                subtitle: `${pm.uniqueId ? `${pm.uniqueId} ` : " "}`,
                onClick: () => {
                  editablePaymentMethod.value = pm;
                  isEditorOpen.value = true;
                },
                child: m.Div({
                  class: "mv3",
                  children: m.For({
                    subject: pm.accounts,
                    map: (pmAcc) => m.Span(pmAcc.name),
                  }),
                }),
              }),
          }),
        }),
      ],
    });
  }
);
