import { m } from "@mufw/maya";
import { HtmlPage } from "../../@libs/components";
import { fetchAllAccounts } from "../../@libs/stores/accounts";
import { fetchAllPaymentServices } from "../../@libs/stores/payment-services";

export default HtmlPage({
  htmlTitle: "Batua | Accounts & Assets",
  headerTitle: "Accounts and payment services",
  selectedTabIndex: 4,
  onDocumentMount: () => {
    fetchAllPaymentServices();
    fetchAllAccounts();
  },
  mainContent: m.Div("Account details page"),
  sideContent: "",
});
