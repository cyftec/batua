import { Children, component, m } from "@mufw/maya";
import { Button } from "./Button";

type DialogActionButtonsProps = {
  cssClasses?: string;
  discardLabel: Children;
  commitLabel: Children;
  onDiscard: () => void;
  onCommit: () => void;
};

export const DialogActionButtons = component<DialogActionButtonsProps>(
  ({ cssClasses, discardLabel, commitLabel, onDiscard, onCommit }) => {
    return m.Div({
      class: cssClasses,
      children: m.Div({
        class: "flex items-center justify-between pv2",
        children: [
          Button({
            onTap: onDiscard,
            cssClasses: `w-100 pv2dot5 ph2 flex items-center justify-center`,
            children: discardLabel,
          }),
          m.Div({ class: "pa1" }),
          Button({
            onTap: onCommit,
            cssClasses: `w-100 pv2dot5 ph2 flex items-center justify-center`,
            children: commitLabel,
          }),
        ],
      }),
    });
  }
);
