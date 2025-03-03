import { m } from "@mufw/maya";
import { HtmlPage } from "../@libs/components";
import { AccountsList, PaymentMethods } from "./@components";

export default HtmlPage({
  htmlTitle: "Batua | Accounts & Assets",
  headerTitle: "Accounts and payment methods",
  selectedTabIndex: 4,
  mainContent: m.Div([
    AccountsList({
      classNames: "mb5",
    }),
    PaymentMethods({
      classNames: "mb4",
    }),
  ]),
  sideContent: "",
});
