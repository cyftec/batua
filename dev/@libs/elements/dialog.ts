import { type Child, component, m } from "@mufw/maya";
import { Button, Modal } from ".";

type Dialog = {
  isOpen: boolean;
  header: string;
  headerChild?: Child;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onTapOutside?: () => void;
  child: Child;
};

export const Dialog = component<Dialog>(
  ({ header, headerChild, isOpen, onPrev, onNext, onTapOutside, child }) => {
    return Modal({
      classNames: "pa4",
      isOpen: isOpen,
      onTapOutside,
      content: m.Div([
        m.Div({
          class: "flex items-center justify-between",
          children: [
            m.H2({
              class: "ma0",
              children: header,
            }),
            m.If({
              subject: headerChild,
              isTruthy: headerChild,
            }),
          ],
        }),
        m.Div({
          class: "mt4",
          children: child,
        }),
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
  }
);
