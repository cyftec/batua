import { Component, derived, drstr, m } from "@maya/core";
import { Button } from "../../@components";

type SummaryProps = {
  className?: string;
  title: string;
  amount: string;
};

export const Summary = Component<SummaryProps>(
  ({ className, title, amount }) => {
    return m.Div({
      class: drstr`flex flex-column items-center ${className}`,
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
          label: "Add new expense",
          onTap: function (): void {
            throw new Error("Function not implemented.");
          },
        }),
      ],
    });
  }
);
