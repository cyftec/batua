import { m, component } from "@mufw/maya";
import {
  derived,
  dpromise,
  dstring,
  signal,
  type DerivedSignal,
} from "@cyftech/signal";
import type { ID, PaymentMethod } from "../../@libs/common";
import { db } from "../../@libs/storage/localdb";
import { Icon } from "../../@libs/elements";
import { AddButtonTile, ListTile, SectionTitle } from "../../@libs/components";
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
    const [fecthPaymentMethods, paymentMethods] = dpromise(() =>
      db.paymentMethods.getAll()
    );

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
      fecthPaymentMethods();
    };

    return m.Div({
      onmount: fecthPaymentMethods,
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
          classNames: "mt2 mb4",
          iconName: "account_balance_wallet",
          label: "Payment Methods and Wallet Apps",
        }),
        m.If({
          subject: paymentMethods,
          isFalsy: m.Span("Loading..."),
          isTruthy: m.Div({
            class: "flex flex-wrap nl4",
            children: m.For({
              subject: paymentMethods as DerivedSignal<PaymentMethod[]>,
              n: Infinity,
              nthChild: AddButtonTile({
                classNames: "ba bw1 b--near-white ml4 mb4 pt4 w-43",
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
                  classNames: "ba bw1 b--near-white ml4 mb4 w-43",
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
