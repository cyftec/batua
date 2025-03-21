import { dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import type { PaymentServiceUI } from "../../@libs/common";
import { AddButtonTile, ListTile, SectionTitle } from "../../@libs/components";
import { Icon } from "../../@libs/elements";
import { allPaymentServices } from "../../@libs/stores/payment-services";
import { PaymentServiceEditor } from "./payment-service-editor";

type PaymentServicesProps = {
  classNames?: string;
};

export const PaymentServices = component<PaymentServicesProps>(
  ({ classNames }) => {
    const isEditorOpen = signal(false);
    const editablePaymentService = signal<PaymentServiceUI | undefined>(
      undefined
    );

    const closeEditor = () => {
      editablePaymentService.value = undefined;
      isEditorOpen.value = false;
    };

    return m.Div({
      class: dstring`${classNames}`,
      children: [
        PaymentServiceEditor({
          isOpen: isEditorOpen,
          dialogTitle: dstring`${() =>
            editablePaymentService.value
              ? `Edit '${editablePaymentService.value.name}'`
              : "Add new"} payment service`,
          editablePaymentService: editablePaymentService,
          onDone: closeEditor,
          onCancel: closeEditor,
        }),
        SectionTitle({
          iconName: "account_balance_wallet",
          label: "Digital Wallets and Payment Services",
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: allPaymentServices,
            n: Infinity,
            nthChild: AddButtonTile({
              classNames: "mr3 mt3 pt4 w-43",
              tooltip: "Add new payment service",
              onClick: () => (isEditorOpen.value = true),
              children: Icon({
                className: "mb2 silver",
                size: 42,
                iconName: "add",
              }),
            }),
            map: (ps) =>
              ListTile({
                classNames: "mr3 mt3 w-43",
                title: ps.name,
                subtitle: `${ps.uniqueId ? `${ps.uniqueId} ` : " "}`,
                onClick: () => {
                  editablePaymentService.value = ps;
                  isEditorOpen.value = true;
                },
                child: m.Div({
                  class: "mv3",
                  children: m.For({
                    subject: ps.accounts,
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
