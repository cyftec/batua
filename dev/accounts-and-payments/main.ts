import { m } from "@maya/core";
import { Page } from "../@libs/widgets";
import { AccountsList, PaymentMethodsList } from "./@components";

export default () =>
  Page({
    title: "Batua | Accounts & Assets",
    headerTitle: "Accounts and payment methods",
    selectedTabIndex: 4,
    mainContent: m.Div([
      AccountsList({
        classNames: "pv4",
      }),
      PaymentMethodsList({
        classNames: "pv4",
      }),
    ]),
    sideContent: "",
  });
