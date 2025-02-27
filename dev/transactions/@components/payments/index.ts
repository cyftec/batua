import { component, m } from "@mufw/maya";
import { dbools, derived, dstring, val } from "@cyftech/signal";
import {
  CURRENCIES,
  type CurrencyCode,
  type Payment,
} from "../../../@libs/common";
import { Link } from "../../../@libs/elements";
import { PaymentTile } from "./payment-tile";

type PaymentsProps = {
  classNames?: string;
  payments: Payment[];
  onchange: (payments: Payment[]) => void;
};

export const Payments = component<PaymentsProps>(
  ({ classNames, payments, onchange }) => {
    const borderClass = "br3 bw1 ba b--light-gray";
    const [singlePayment, multiPayments] = dbools(
      () => payments.value.length < 2
    );
    const paymentTileClass = derived(() =>
      singlePayment.value ? borderClass + " pl2" : ""
    );
    const containerClass = derived(() =>
      multiPayments.value ? borderClass + " pa2" : ""
    );
    const paymentTileLinkLabel = dstring`${() =>
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

    const onAdd = () => {};

    const onRemove = (index: number) => {};

    const onPaymentUpdate = (index: number, updated: Payment) => {
      const updatedPayments = [...payments.value];
      updatedPayments[index] = updated;
      onchange(updatedPayments);
    };

    return m.Div({
      class: dstring`${containerClass} ${classNames}`,
      children: [
        m.Div(
          m.For({
            subject: derived(() =>
              payments.value.map((p, index) => ({ ...p, index }))
            ),
            itemKey: "index",
            map: (payment) =>
              PaymentTile({
                classNames: paymentTileClass,
                linkLabel: paymentTileLinkLabel,
                payment,
                onPaymentUpdate,
                onLinkClick: (index) => {
                  if (multiPayments.value) onRemove(index);
                  else onAdd();
                },
              }),
          })
        ),
        m.If({
          subject: multiPayments,
          isTruthy: m.Div({
            class: "flex items-center justify-between mt3",
            children: [
              m.Span({
                class: "black flex items-center",
                children: [
                  m.Span({
                    class: dstring`f5 mr2 silver ${() =>
                      paidLabel.value ||
                      !(paidLabel.value || receivedLabel.value)
                        ? "di"
                        : "dn"}`,
                    children: "Paid:",
                  }),
                  m.Span({
                    class: dstring`f3 mr3 ${() =>
                      paidLabel.value ? "di" : "dn"}`,
                    children: paidLabel,
                  }),
                  m.Span({
                    class: dstring`f5 mr2 silver ${() =>
                      receivedLabel.value ? "di" : "dn"}`,
                    children: "Received:",
                  }),
                  m.Span({
                    class: dstring`f3 ${() =>
                      receivedLabel.value ? "di" : "dn"}`,
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
  }
);
