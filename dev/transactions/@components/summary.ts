import { component, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";
import { Button } from "../../@libs/elements";

type SummaryProps = {
  className?: string;
  title: string;
  amount: string;
  onAddTransaction: () => void;
};

export const Summary = component<SummaryProps>(
  ({ className, title, amount, onAddTransaction }) => {
    return m.Div({
      class: dstring`flex flex-column items-center vh-90 ${className}`,
      style: "height: 38rem;",
      children: [
        m.Div(title),
        m.Div({ class: "h-100", children: amount }),
        Button({
          className: "ph3",
          label: "See more trends",
          onTap: onAddTransaction,
        }),
      ],
    });
  }
);
