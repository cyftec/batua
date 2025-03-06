import { m } from "@mufw/maya";
import { HtmlPage } from "../@libs/components";
import { AccountsList, PaymentMethods } from "./@components";
import { fetchAllPaymentMethods } from "../@libs/stores/payment-methods";
import { fetchAllAccounts } from "../@libs/stores/accounts";

export default HtmlPage({
  htmlTitle: "Batua | Accounts & Assets",
  headerTitle: "Accounts and payment methods",
  selectedTabIndex: 4,
  onDocumentMount: () => {
    fetchAllPaymentMethods();
    fetchAllAccounts();
  },
  mainContent: m.Div([
    PaymentMethods({ classNames: "mb5" }),
    AccountsList({ classNames: "mb5" }),
  ]),
  sideContent: "",
});
