import { m } from "@maya/core";
import { Page } from "../@libs/ui-kit";
import { AccountsList, PaymentMethodsList } from "./@components";

export default () =>
  Page({
    title: "Batua | Accounts & Assets",
    headerTitle: "Accounts and payment methods",
    selectedTabIndex: 4,
    content: m.Div({
      children: [
        AccountsList({
          classNames: "pv4",
        }),
        PaymentMethodsList({
          classNames: "pv4",
        }),
      ],
    }),
  });
