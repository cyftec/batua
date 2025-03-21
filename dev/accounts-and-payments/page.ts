import { m } from "@mufw/maya";
import { HtmlPage } from "../@libs/components";
import { AccountsList, PaymentServices } from "./@components";
import { fetchAllPaymentServices } from "../@libs/stores/payment-services";
import { fetchAllAccounts } from "../@libs/stores/accounts";

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
    AccountsList({ classNames: "mb5" }),
  ]),
  sideContent: "",
});
