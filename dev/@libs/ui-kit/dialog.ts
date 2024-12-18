import { type Child, type Component, m } from "@maya/core";
import { Button, Modal } from ".";

type Dialog = {
  isOpen: boolean;
  header: string;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onTapOutside?: () => void;
  child: Child;
};

export const Dialog: Component<Dialog> = ({
  header,
  isOpen,
  onPrev,
  onNext,
  onTapOutside,
  child,
}) => {
  console.log(isOpen);
  return Modal({
    classNames: "pa4",
    isOpen: isOpen,
    onTapOutside,
    content: m.Div([
      m.H2({
        class: "ma0 pb4",
        children: header,
      }),
      child,
      m.Div({
        class: "flex items-center w-100 pt4",
        children: [
          Button({
            className: "w-inherit",
            label: "Cancel",
            onTap: onPrev,
          }),
          m.Span({ class: "pa3" }),
          Button({
            className: "w-inherit",
            label: "Save",
            onTap: onNext,
          }),
        ],
      }),
    ]),
  });
};
