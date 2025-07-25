import { component, m } from "@mufw/maya";
import { Select } from "../../../@libs/elements";
import { TXN_TYPES, TxnType } from "../../../@libs/common/models/core";
import { op, trap } from "@cyftech/signal";
import { capitalize } from "../../../@libs/common/utils";

type TransactionTypeSelectorProps = {
  txnType: TxnType;
  onChange: (newType: TxnType) => void;
};

export const TransactionTypeSelector = component<TransactionTypeSelectorProps>(
  ({ txnType, onChange }) => {
    const TXN_TYPE_KEYS = Object.keys(TXN_TYPES) as TxnType[];

    return m.Div({
      class: "flex items-center",
      children: [
        Select({
          anchor: "left",
          options: Object.values(TXN_TYPES),
          selectedOptionIndex: trap(TXN_TYPE_KEYS).indexOf(txnType),
          onChange: (op) => onChange(TXN_TYPE_KEYS[op]),
        }),
        m.If({
          subject: op(txnType).equals("transfer").truthy,
          isTruthy: () =>
            Select({
              options: ["borrow", "lend", "gift", "settlement", "restructure"],
              selectedOptionIndex: 0,
              targetFormattor: (opt) => `as ${capitalize(opt)}`,
              optionFormattor: (opt) =>
                m.Div({
                  children: [
                    m.Div({ class: "f7 silver", children: "as" }),
                    m.Div(capitalize(opt)),
                  ],
                }),
              onChange: function (optionIndex: number): void {
                throw new Error("Function not implemented.");
              },
            }),
        }),
      ],
    });
  }
);
