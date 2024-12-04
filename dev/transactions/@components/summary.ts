import { component, m } from "@maya/core";
import { dstr } from "@maya/signal";
import { Button } from "../../@libs/ui-kit";

type SummaryProps = {
  className?: string;
  title: string;
  amount: string;
  onAddTransaction: () => void;
};

export const Summary = component<SummaryProps>(
  ({ className, title, amount, onAddTransaction }) => {
    return m.Div({
      class: dstr`flex flex-column items-center ${className}`,
      style: "height: 38rem; min-width: 20rem;",
      children: [
        m.Div({
          children: m.Text(title),
        }),
        m.Div({
          children: m.Text(amount),
        }),
        Button({
          className: "ph3",
          label: "Add new transaction",
          onTap: onAddTransaction,
        }),
      ],
    });
  }
);
