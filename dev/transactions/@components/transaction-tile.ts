import { m, type Component } from "@maya/core";
import { derived, dprops, dstr, val, type Signal } from "@maya/signal";
import type { TransactionUI } from "../../@libs/common";

type TransactionTileProps = {
  className?: string;
  transaction: TransactionUI;
  onClick: () => void;
};

export const TransactionTile: Component<TransactionTileProps> = ({
  className,
  transaction,
  onClick,
}) => {
  const { title, date, payments, tags } = dprops(
    derived(() => val(transaction))
  );
  const amount = derived(() => (payments.value[0]?.amount || 0).toFixed(2));

  return m.Div({
    class: dstr`flex items-start br4 pa3 hover-pop pointer ${className}`,
    onclick: onClick,
    children: [
      m.Div({
        class: "mnw4 fw2 black",
        children: [
          m.Span({
            id: "abcd",
            class: "f2 gray",
            children: derived(() => val(amount).split(".")[0]),
          }),
          m.Span({
            class: "f7 gray",
            children: dstr`.${() => val(amount).split(".")[1]}`,
          }),
        ],
      }),
      m.Div({
        class: "mr3",
        style: "max-width: 20rem;",
        children: [
          m.Div({
            class: "truncate mnw5 mr3 mb1 f4",
            children: title,
          }),
          m.Div({
            class: "flex flex-wrap",
            children: m.For({
              items: tags,
              map: (tag) =>
                m.Span({
                  class: "mr2 f7 silver",
                  children: `#${tag}`,
                }),
            }),
          }),
        ],
      }),
      m.Div({
        class: "mnw3",
        children: [
          // m.Div(paymentMethod),
          m.Div({
            class: "mt1 f7 silver",
            children: derived(() =>
              date.value.toLocaleDateString(undefined, {
                weekday: "short",
                day: "numeric",
                month: "short",
              })
            ),
          }),
        ],
      }),
    ],
  });
};
