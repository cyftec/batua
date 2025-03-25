import { m, component } from "@mufw/maya";
import { derived, dprops, dstring, val, type Signal } from "@cyftech/signal";
import type { TransactionUI } from "../../../@libs/common";
import { Icon } from "../../../@libs/elements";

type TransactionTileProps = {
  className?: string;
  transaction: TransactionUI;
  onClick: () => void;
};

export const TransactionTile = component<TransactionTileProps>(
  ({ className, transaction, onClick }) => {
    const { title, date, payments, tags } = dprops(
      derived(() => transaction.value)
    );
    const amount = derived(() => (payments.value[0]?.amount || 0).toFixed(2));

    return m.Div({
      class: dstring`flex items-start justify-between br4 pa3 nl3 nr3 hover-pop pointer ${className}`,
      onclick: onClick,
      children: [
        m.Div({
          class: "fg1 fw2 black",
          children: [
            m.Span({
              id: "abcd",
              class: dstring`gray ${() =>
                amount.value.length > 7 ? "f3 pt2" : "f2"}`,
              children: derived(() => amount.value.split(".")[0]),
            }),
            m.Span({
              class: "f7 gray",
              children: dstring`.${() => amount.value.split(".")[1]}`,
            }),
          ],
        }),
        m.Div({
          class: "fg3",
          children: [
            m.Div({
              class: "truncate mnw5 mr3 mb1 f4",
              children: title,
            }),
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: tags,
                map: (tag, i) =>
                  m.Span({
                    class: "f7 silver flex items-center",
                    children: [
                      m.Span({
                        class: dstring`white bg-moon-gray br-100 h1 w1 flex items-center justify-center ${
                          i > 0 ? "ml2" : ""
                        }`,
                        children: Icon({
                          size: 12,
                          iconName: tag.category.icon,
                        }),
                      }),
                      m.Span({ class: "ml1", children: tag.name }),
                    ],
                  }),
              }),
            }),
          ],
        }),
        m.Div({
          class: "fg1 flex justify-end",
          children: [
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
  }
);
