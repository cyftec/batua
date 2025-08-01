import { derive, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  TXN_TYPE_SUBTYPE_MAP,
  TxnSubType,
  TxnType,
} from "../../../../../models/core";
import { capitalize } from "../../../../../state/utils";
import { PairSelect } from "../../../../elements";

type TransactionTypeSelectorProps = {
  txnType: TxnType;
  txnSubType: TxnSubType;
  onChange: (newType: TxnType, subType: TxnSubType) => void;
};

export const TransactionTypeSelector = component<TransactionTypeSelectorProps>(
  ({ txnType, txnSubType, onChange }) => {
    const TXN_TYPES = Object.keys(TXN_TYPE_SUBTYPE_MAP) as TxnType[];
    const TXN_SUBTYPES = derive(() => TXN_TYPE_SUBTYPE_MAP[txnType.value]);
    const subTypeIndex = derive(() => {
      console.log(TXN_SUBTYPES.value);
      console.log(txnSubType.value);
      const index = TXN_SUBTYPES.value.indexOf(txnSubType.value as any);
      console.log(index);
      return index;
    });

    return PairSelect({
      anchor: "left",
      primaryOptions: TXN_TYPES,
      secondaryOptions: TXN_SUBTYPES,
      primarySelectedOptionIndex: trap(TXN_TYPES).indexOf(txnType),
      secondarySelectedOptionIndex: subTypeIndex,
      primaryTargetFormattor: (opt) => capitalize(opt),
      primaryOptionFormattor: (opt) => capitalize(opt),
      secondaryTargetFormattor: (opt) => `as ${capitalize(opt)}`,
      secondaryOptionFormattor: (opt) =>
        m.Div({
          children: [
            m.Div({ class: "f7 silver", children: "as" }),
            m.Div(capitalize(opt)),
          ],
        }),
      onChange: (primaryOptionIndex, secondaryOptionIndex) => {
        const newType = TXN_TYPES[primaryOptionIndex];
        const newSubType = TXN_TYPE_SUBTYPE_MAP[newType][secondaryOptionIndex];
        onChange(newType, newSubType);
      },
    });
    // return m.Div({
    //   class: "flex items-center",
    //   children: [
    //     Select({
    //       anchor: "left",
    //       options: TXN_TYPES,
    //       selectedOptionIndex: trap(TXN_TYPES).indexOf(txnType),
    //       targetFormattor: (opt) => capitalize(opt),
    //       optionFormattor: (opt) => capitalize(opt),
    //       onChange: (op) => onChange(TXN_TYPES[op]),
    //     }),
    //     m.If({
    //       subject: trap(["transfer", "expense"]).includes(txnType),
    //       isTruthy: () =>
    //         Select({
    //           options: derive(() =>
    //             txnType.value === "transfer"
    //               ? ["restructure", "settlement", "borrow", "lend", "gift"]
    //               : ["settled expense", "unsettled expense"]
    //           ),
    //           selectedOptionIndex: 0,
    //           targetFormattor: (opt) => `as ${capitalize(opt)}`,
    //           optionFormattor: (opt) =>
    //             m.Div({
    //               children: [
    //                 m.Div({ class: "f7 silver", children: "as" }),
    //                 m.Div(capitalize(opt)),
    //               ],
    //             }),
    //           onChange: function (optionIndex: number): void {
    //             throw new Error("Function not implemented.");
    //           },
    //         }),
    //     }),
    //   ],
    // });
  }
);
