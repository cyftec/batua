import { Component, m } from "@maya/core";
import { dstr } from "@maya/signal";
import { MOCK } from "../../@libs/common";
import { SectionTitle, AddButtonTile, ListTile } from "../../@libs/widgets";
import { Tag } from "../../@libs/ui-kit";

type PaymentMethodsListProps = {
  classNames?: string;
};

export const PaymentMethodsList: Component<PaymentMethodsListProps> = ({
  classNames,
}) =>
  m.Div({
    class: dstr`${classNames}`,
    children: [
      SectionTitle({
        classNames: "mt2 mb4",
        iconName: "account_balance_wallet",
        label: "Payment Methods and Wallet Apps",
      }),
      m.Div({
        class: "flex flex-wrap nl4",
        children: m.For({
          items: MOCK.PAYMENT_METHODS,
          n: 1000,
          nthChild: () => {
            return AddButtonTile({
              classNames: "ba bw1 b--near-white ml4 mb4 pt4 h5 w-43",
              label: "Add new payment method",
              onClick: () => console.log("Add new payment method"),
            });
          },
          map: (pm) =>
            ListTile({
              classNames: "ba bw1 b--near-white ml4 mb4 h5 w-43",
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
                    return Tag({ classNames: "ph3 pv2 mr2 mb2", label });
                  },
                }),
              }),
            }),
        }),
      }),
    ],
  });
