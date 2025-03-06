import { derived, dstring, signal, type DerivedSignal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import type { ID, PaymentMethod } from "../../@libs/common";
import { AddButtonTile, ListTile, SectionTitle } from "../../@libs/components";
import { Icon } from "../../@libs/elements";
import { allPaymentMethods } from "../../@libs/stores/payment-methods";
import { PaymentMethodEditor } from "./payment-method-editor";

type PaymentMethodsProps = {
  classNames?: string;
};

export const PaymentMethods = component<PaymentMethodsProps>(
  ({ classNames }) => {
    const initService = (id: ID): PaymentMethod => ({
      id: id,
      name: "",
      uniqueId: undefined,
      expiry: undefined,
    });
    const isEditorOpen = signal(false);
    const editingServiceName = signal("");
    const editingService = signal(initService(crypto.randomUUID()));
    const error = signal("");

    const validateEditingService = () => {
      error.value = "";
    };

    const resetEditor = () => {
      editingServiceName.value = "";
      editingService.value = initService(crypto.randomUUID());
      error.value = "";
      isEditorOpen.value = false;
    };

    const saveSevice = () => {
      validateEditingService();
      if (error.value) return;

      console.log(editingService.value);
    };

    return m.Div({
      class: dstring`${classNames}`,
      children: [
        PaymentMethodEditor({
          isOpen: isEditorOpen,
          dialogTitle: derived(() =>
            editingServiceName.value
              ? `Edit payment service - '${editingServiceName.value}'`
              : "Add new payment service"
          ),
          editingService: editingService,
          onChange: (paymentMethod) => (editingService.value = paymentMethod),
          onCancel: resetEditor,
          onSave: saveSevice,
        }),
        SectionTitle({
          iconName: "account_balance_wallet",
          label: "Digital Wallets and Payment Methods",
        }),
        m.If({
          subject: allPaymentMethods,
          isFalsy: m.Span("Loading..."),
          isTruthy: m.Div({
            class: "flex flex-wrap",
            children: m.For({
              subject: allPaymentMethods as DerivedSignal<PaymentMethod[]>,
              n: Infinity,
              nthChild: AddButtonTile({
                classNames: "mr3 mt3 pt4 w-43",
                onClick: () => (isEditorOpen.value = true),
                children: [
                  Icon({
                    className: "mb2",
                    size: 42,
                    iconName: "add",
                  }),
                  m.Div({
                    class: "light-silver f6",
                    children: "Add new payment method",
                  }),
                ],
              }),
              map: (ps) =>
                ListTile({
                  classNames: "mr3 mt3 w-43",
                  title: ps.name,
                  subtitle: `${ps.uniqueId ? `${ps.uniqueId} ` : " "}${
                    ps.expiry ? " • " + ps.expiry.toLocaleDateString() : " "
                  }`,
                  onClick: () => {
                    editingServiceName.value = ps.name;
                    editingService.value = ps;
                    isEditorOpen.value = true;
                  },
                  child: m.Div({
                    class: "mt3",
                    children: "Something to fill here",
                  }),
                }),
            }),
          }),
        }),
      ],
    });
  }
);
