import { m } from "@mufw/maya";
import { Page } from "../@libs/components";
import { AccountsList, PaymentMethods } from "./@components";

export default Page({
  htmlTitle: "Batua | Accounts & Assets",
  headerTitle: "Accounts and payment methods",
  selectedTabIndex: 4,
  mainContent: m.Div([
    AccountsList({
      classNames: "pv4",
    }),
    PaymentMethods({
      classNames: "pv4",
    }),
  ]),
  sideContent: "",
});
