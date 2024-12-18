import { type Component, m } from "@maya/core";
import { derived, dstr, val } from "@maya/signal";
import {
  CURRENCIES,
  type CurrencyCode,
  type Payment,
} from "../../../@libs/common";
import { Link } from "../../../@libs/ui-kit";
import { PaymentTile } from "./payment-tile";

type PaymentsProps = {
  classNames?: string;
  payments: Payment[];
  onchange: (payments: Payment[]) => void;
};

export const Payments: Component<PaymentsProps> = ({
  classNames,
  payments,
  onchange,
}) => {
  const borderClass = "br3 bw1 ba b--light-gray";
  const multiPayments = derived(() => val(payments).length > 1);
  const paymentTileClass = derived(() =>
    !val(multiPayments) ? borderClass + " pl2" : ""
  );
  const containerClass = derived(() =>
    val(multiPayments) ? borderClass + " pa2" : ""
  );
  const paymentTileLinkLabel = dstr`${() =>
    val(multiPayments) ? "remove" : "add more"} payment`;
  const totalPaymentLabels = derived(() => {
    const sumObj: Record<string, number> = val(payments).reduce((sum, p) => {
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
  const paidLabel = derived(() => val(totalPaymentLabels)[0]);
  const receivedLabel = derived(() => val(totalPaymentLabels)[1]);

  const onAdd = () => {};

  const onRemove = (index: string) => {};

  const onPaymentUpdate = (index: number, updated: Payment) => {
    const updatedPayments = [...val(payments)];
    updatedPayments[index] = updated;
    onchange(updatedPayments);
  };

  return m.Div({
    class: dstr`${containerClass} ${classNames}`,
    children: [
      m.Div(
        m.For({
          items: derived(() =>
            val(payments).map((p, index) => ({ ...p, index }))
          ),
          mutableMap: (payment) =>
            PaymentTile({
              classNames: paymentTileClass,
              linkLabel: paymentTileLinkLabel,
              payment,
              onPaymentUpdate,
              onLinkClick: (index) => {
                if (val(multiPayments)) onRemove(index);
                else onAdd();
              },
            }),
        })
      ),
      m.If({
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
                      val(paidLabel) || !(val(paidLabel) || val(receivedLabel))
                        ? "di"
                        : "dn"}`,
                    children: "Paid:",
                  }),
                  m.Span({
                    class: dstr`f3 mr3 ${() => (val(paidLabel) ? "di" : "dn")}`,
                    children: paidLabel,
                  }),
                  m.Span({
                    class: dstr`f5 mr2 silver ${() =>
                      val(receivedLabel) ? "di" : "dn"}`,
                    children: "Received:",
                  }),
                  m.Span({
                    class: dstr`f3 ${() => (val(receivedLabel) ? "di" : "dn")}`,
                    children: receivedLabel,
                  }),
                ],
              }),
              Link({
                label: "add more payment",
                onClick: onAdd,
              }),
            ],
          }),
      }),
    ],
  });
};
