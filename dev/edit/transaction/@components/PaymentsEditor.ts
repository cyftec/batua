import { component, m } from "@mufw/maya";
import { AccountUI, Payment } from "../../../@libs/common/models/core";
import {
  DialogActionButtons,
  Link,
  Modal,
  TextBox,
} from "../../../@libs/elements";
import { PaymentTile } from "./PaymentTile";
import { signal } from "@cyftech/signal";
import { db } from "../../../@libs/common/localstorage/stores";
import {
  deepTrim,
  deepTrimmedLowercase,
  getValidName,
  nameRegex,
} from "../../../@libs/common/utils";

type PaymentsEditorProps = {
  cssClasses?: string;
  payments: Payment[];
  allAccounts: AccountUI[];
  onPaymentAdd: () => void;
  onPaymentUpdate: (newPayment: Payment, index: number) => void;
  onPaymentDelete: (index: number) => void;
  onNewPeopleAccountAdd: () => void;
};

export const PaymentsEditor = component<PaymentsEditorProps>(
  ({
    cssClasses,
    payments,
    allAccounts,
    onPaymentAdd,
    onPaymentUpdate,
    onPaymentDelete,
    onNewPeopleAccountAdd,
  }) => {
    const peopleAccountEditorOpen = signal(false);
    const paymentIndexForAddingPersonAcc = signal(-1);
    const peopleAccountName = signal("");
    const error = signal("");

    const openEditor = (paymentIndex: number) => {
      paymentIndexForAddingPersonAcc.value = paymentIndex;
      peopleAccountEditorOpen.value = true;
    };
    const closeEditor = () => {
      paymentIndexForAddingPersonAcc.value = -1;
      peopleAccountEditorOpen.value = false;
    };

    const validate = () => {
      if (getValidName(peopleAccountName.value) !== peopleAccountName.value) {
        error.value =
          "Unnecessary blank spaces or invalid characters in the name";
        return;
      }
      const existingAccount = db.accounts.getWhere(
        (acc) =>
          deepTrimmedLowercase(acc.name) ===
          deepTrimmedLowercase(peopleAccountName.value)
      );
      if (existingAccount) {
        error.value = `Account with name '${existingAccount.name}' already exists`;
        return;
      }
      error.value = "";
    };

    const onPeopleAccountAdd = () => {
      validate();
      if (error.value) return;
      const newAccID = db.accounts.add({
        isPermanent: 0,
        name: peopleAccountName.value,
        balance: 0,
        type: "People",
      });
      onNewPeopleAccountAdd();
      const newAcc = allAccounts.value.find(
        (acc) => acc.name === peopleAccountName.value
      );
      if (!newAcc) throw ``;
      const newPaymentIndex = paymentIndexForAddingPersonAcc.value;
      const newPayment: Payment = {
        amount: payments.value[newPaymentIndex].amount,
        account: newAcc.id,
      };
      onPaymentUpdate(newPayment, newPaymentIndex);
      peopleAccountName.value = "";
      closeEditor();
    };

    return m.Div({
      class: cssClasses,
      children: [
        Modal({
          cssClasses: "w-80 ph2",
          isOpen: peopleAccountEditorOpen,
          onTapOutside: closeEditor,
          content: [
            m.Div({
              class: "b f5 mb3 ph2 pv3",
              children: "Add your friend as an outstanding account",
            }),
            TextBox({
              cssClasses: "w-100 ba br4 b--light-silver mb4 pa3",
              text: peopleAccountName,
              placeholder: "Name of your friend",
              onchange: (text) => (peopleAccountName.value = text),
            }),
            DialogActionButtons({
              cssClasses: "bg-near-white nl2 nr2 ph2",
              discardLabel: "Discard",
              commitLabel: "Add",
              error,
              onDiscard: closeEditor,
              onCommit: onPeopleAccountAdd,
            }),
          ],
        }),
        m.Div(
          m.For({
            subject: payments,
            n: Infinity,
            nthChild: m.Div({
              class: "mb2 flex items-center justify-end",
              children: Link({
                onClick: onPaymentAdd,
                cssClasses: "f6 mt2",
                children: "Add new payment",
              }),
            }),
            map: (payment, index) =>
              PaymentTile({
                payment: payment,
                allAccounts: allAccounts,
                onPeopleAccountAdd: () => openEditor(index),
                onChange: (newPmt) => onPaymentUpdate(newPmt, index),
                onRemove: () => onPaymentDelete(index),
              }),
          })
        ),
      ],
    });
  }
);
