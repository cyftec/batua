import { m } from "@mufw/maya";
import { HtmlPage } from "../@libs/components";
import { AccountsList, PaymentServices } from "./@components";
import { fetchAllPaymentServices } from "../@libs/stores/payment-services";
import { fetchAllAccounts } from "../@libs/stores/accounts";
import { signal } from "@cyftech/signal";
import { AccountEditor } from "./@components/account-editor";
import { AccountUI } from "../@libs/common";

const isAccountEditorOpen = signal(false);
const editableAccount = signal<AccountUI | undefined>(undefined);

const resetEditor = () => {
  editableAccount.value = undefined;
  isAccountEditorOpen.value = false;
};

export default HtmlPage({
  htmlTitle: "Batua | Accounts & Assets",
  headerTitle: "Accounts and payment services",
  selectedTabIndex: 4,
  onDocumentMount: () => {
    fetchAllPaymentServices();
    fetchAllAccounts();
  },
  mainContent: m.Div([
    PaymentServices({ classNames: "mb5" }),
    AccountsList({
      classNames: "mb5",
      onAccountEdit: (acc) => {
        editableAccount.value = acc;
        isAccountEditorOpen.value = true;
      },
    }),
    AccountEditor({
      isOpen: isAccountEditorOpen,
      editableAccount: editableAccount,
      onCancel: resetEditor,
      onDone: resetEditor,
    }),
  ]),
  sideContent: "",
});
