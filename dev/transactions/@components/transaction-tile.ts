import { Component, m } from "@maya/core";
import { derived, dstr, val } from "@maya/signal";

type TransactionTileProps = {
  className?: string;
  amount: string;
  title: string;
  date: Date;
  tags: string[];
  paymentMethod: string;
};

export const TransactionTile: Component<TransactionTileProps> = ({
  className,
  amount,
  title,
  date,
  tags,
  paymentMethod,
}) => {
  return m.Div({
    class: dstr`flex items-start ${className}`,
    children: [
      m.Div({
        class: "mnw4",
        children: [
          m.Span({
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
        style: "max-width: 24rem;",
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
        children: [
          m.Div({
            children: paymentMethod,
          }),
          m.Div({
            class: "mt1 f7 silver",
            children: derived(() =>
              val(date).toLocaleDateString(undefined, {
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
