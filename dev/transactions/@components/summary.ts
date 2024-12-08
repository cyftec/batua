import { Component, m } from "@maya/core";
import { dstr } from "@maya/signal";
import { Button } from "../../@libs/ui-kit";

type SummaryProps = {
  className?: string;
  title: string;
  amount: string;
  onAddTransaction: () => void;
};

export const Summary: Component<SummaryProps> = ({
  className,
  title,
  amount,
  onAddTransaction,
}) => {
  return m.Div({
    class: dstr`flex flex-column items-center ${className}`,
    style: "height: 38rem;",
    children: [
      m.Div(title),
      m.Div(amount),
      Button({
        className: "ph3",
        label: "Add new transaction",
        onTap: onAddTransaction,
      }),
    ],
  });
};
