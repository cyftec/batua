import { component, m } from "@maya/core";
import { derived, dstr } from "@maya/signal";
import { CURRENCIES, CurrencyCode, Payment } from "../../../@libs/common";
import { Link } from "../../../@libs/ui-kit";
import { PaymentTile } from "./payment-tile";

type PaymentsProps = {
  classNames?: string;
  payments: Payment[];
  onchange: (payments: Payment[]) => void;
  onadd: () => void;
  onremove: (index: number) => void;
};

export const Payments = component<PaymentsProps>(
  ({ classNames, payments, onchange, onadd, onremove }) => {
    const borderClass = "br3 bw1 ba b--light-gray";
    const multiPayments = derived(() => payments.value.length > 1);
    const paymentTileClass = derived(() =>
      !multiPayments.value ? borderClass + " pl2" : ""
    );
    const containerClass = derived(() =>
      multiPayments.value ? borderClass + " pa2" : ""
    );
    const paymentTileLinkLabel = dstr`${() =>
      multiPayments.value ? "remove" : "add more"} payment`;
    const totalPaymentLabels = derived(() => {
      const sumObj: Record<string, number> = payments.value.reduce((sum, p) => {
        sum[p.currencyCode] = (sum[p.currencyCode] ?? 0) + p.amount;
        return sum;
      }, {});

      return Object.entries(sumObj).reduce(
        (tup, [code, amount]) => {
          const i = amount > 0 ? 0 : amount < 0 ? 1 : 2;
          tup[i] = `${tup[i] ? tup[i] + " + " : ""}${
            CURRENCIES[code as CurrencyCode].symbol
          }${Math.abs(amount)}`;

          return tup;
        },
        ["", "", ""]
      );
    });
    const paidLabel = derived(() => totalPaymentLabels.value[0]);
    const receivedLabel = derived(() => totalPaymentLabels.value[1]);

    const onPaymentUpdate = (index: number, updated: Payment) => {
      const updatedPayments = [...payments.value];
      updatedPayments[index] = updated;
      onchange(updatedPayments);
    };

    return m.Div({
      class: dstr`${containerClass} ${classNames}`,
      children: [
        m.Div({
          children: m.For({
            items: derived(() =>
              payments.value.map((p, index) => ({ ...p, index }))
            ),
            mutableMap: (payment) =>
              PaymentTile({
                classNames: paymentTileClass,
                linkLabel: paymentTileLinkLabel,
                payment,
                onPaymentUpdate,
                onLinkClick: (index) => {
                  if (multiPayments.value) onremove(index);
                  else onadd();
                },
              }),
          }),
        }),
        m.Div({
          class: "ph2",
          children: m.If({
            condition: multiPayments,
            then: () =>
              m.Div({
                class: "flex items-center justify-between mt3",
                children: [
                  m.Span({
                    class: "black flex items-center",
                    children: [
                      m.Span({
                        class: dstr`f5 mr2 silver ${() =>
                          paidLabel.value ||
                          !(paidLabel.value || receivedLabel.value)
                            ? "di"
                            : "dn"}`,
                        children: m.Text("Paid:"),
                      }),
                      m.Span({
                        class: dstr`f3 mr3 ${() =>
                          paidLabel.value ? "di" : "dn"}`,
                        children: m.Text(paidLabel),
                      }),
                      m.Span({
                        class: dstr`f5 mr2 silver ${() =>
                          receivedLabel.value ? "di" : "dn"}`,
                        children: m.Text("Received:"),
                      }),
                      m.Span({
                        class: dstr`f3 ${() =>
                          receivedLabel.value ? "di" : "dn"}`,
                        children: m.Text(receivedLabel),
                      }),
                    ],
                  }),
                  Link({
                    label: "add more payment",
                    onClick: onadd,
                  }),
                ],
              }),
            otherwise: () => m.Text(""),
          }),
        }),
      ],
    });
  }
);
