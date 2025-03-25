import { signal } from "@cyftech/signal";
import { HtmlPage } from "../@libs/components";
import { fetchAllTags } from "../@libs/stores/tags";
import { fetchAllTransactions } from "../@libs/stores/transactions";
import { Summary, TransactionEditor, TransactionsList } from "./@components";
import { TransactionUI } from "../@libs/common";
import { Button } from "../@libs/elements";
import { m } from "@mufw/maya";
import { fetchAllPayments } from "../@libs/stores/payments";

const isEditorOpen = signal(false);
const editableTransaction = signal<TransactionUI | undefined>(undefined);

const openEditor = (editableTxn?: TransactionUI) => {
  editableTransaction.value = editableTxn;
  isEditorOpen.value = true;
};

const closeEditor = () => {
  editableTransaction.value = undefined;
  isEditorOpen.value = false;
};

export default HtmlPage({
  htmlTitle: "Batua - Money Tracker App",
  headerTitle: "Transactions List",
  selectedTabIndex: 0,
  onDocumentMount: () => {
    fetchAllTransactions();
    fetchAllTags();
    fetchAllPayments();
  },
  mainContent: m.Div({
    class: "fg3",
    children: [
      Button({
        label: "Add new transaction",
        onTap: openEditor,
      }),
      TransactionEditor({
        isOpen: isEditorOpen,
        editableTransaction: editableTransaction,
        onCancel: closeEditor,
        onDone: closeEditor,
      }),
      TransactionsList({ onTransactionEdit: openEditor }),
    ],
  }),
  sideContent: Summary({
    className: "sticky top-4 right-0 bottom-0 fg2",
    title: "October 2024",
    amount: "48,513.56",
    onAddTransaction: () => (window.location.href = "/charts.html"),
  }),
});
