import { type Child, component, m } from "@mufw/maya";
import { Button, Modal } from ".";
import { dstring } from "@cyftech/signal";

type Dialog = {
  classNames?: string;
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
  ({
    classNames,
    header,
    headerChild,
    prevLabel,
    nextLabel,
    isOpen,
    onPrev,
    onNext,
    onTapOutside,
    child,
  }) => {
    return Modal({
      classNames: dstring`${classNames}`,
      isOpen: isOpen,
      onTapOutside,
      content: m.Div({
        class: "pa4",
        children: [
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
            class: "flex items-center justify-between w-100 pt4",
            children: [
              Button({
                className: "w-100",
                label: prevLabel,
                onTap: onPrev,
              }),
              m.Span({ class: "pa2" }),
              Button({
                className: "w-100",
                label: nextLabel,
                onTap: onNext,
              }),
            ],
          }),
        ],
      }),
    });
  }
);
