import { Component, m } from "@maya/core";
import { drstr } from "@maya/signal";
import { MOCK } from "../../@libs/common";
import { SectionTitle } from "../../@libs/ui-kit";
import { AddButtonTile } from "./add-button-tile";
import { ListTile } from "./list-tile";

type PaymentMethodsListProps = {
  classNames?: string;
};

export const PaymentMethodsList = Component<PaymentMethodsListProps>(
  ({ classNames }) =>
    m.Div({
      class: drstr`${classNames}`,
      children: [
        SectionTitle({
          classNames: "mt2 mb4",
          iconName: "account_balance_wallet",
          label: "Payment Methods and Wallet Apps",
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            items: MOCK.PAYMENT_METHODS,
            map: (pm) =>
              ListTile({
                classNames: "h5 w-45",
                title: pm.displayName,
                subtitle: `${pm.uniqueId ? `${pm.uniqueId} ` : " "}${
                  pm.expiry ? " • " + pm.expiry.toLocaleDateString() : " "
                }`,
                child: m.Div({
                  class: "mt3 flex flex-wrap",
                  children: m.For({
                    items: pm.connectedAccountIds,
                    map: (accId) => {
                      const label =
                        MOCK.ACCOUNTS.find((a) => a.id === accId)?.name || "";
                      console.log(label);
                      return m.Div({
                        class: "bg-white w4 truncate pa2 mr2 br3",
                        children: m.Text(label),
                      });
                    },
                  }),
                }),
              }),
          }),
        }),
        AddButtonTile({
          classNames: "pt4 h5 w-45",
          label: "Add new payment method",
          onClick: () => console.log("Add new payment method"),
        }),
      ],
    })
);
