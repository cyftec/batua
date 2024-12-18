import {
  type Children,
  type Component,
  type HtmlNode,
  m,
  phases,
} from "@maya/core";
import { dstr, effect, val } from "@maya/signal";

type ModalProps = {
  classNames?: string;
  isOpen: boolean;
  content: Children;
  onTapOutside?: () => void;
};

export const Modal: Component<ModalProps> = ({
  classNames,
  isOpen,
  content,
  onTapOutside,
}) => {
  const dialog: HtmlNode<HTMLDialogElement> = m.Dialog({
    onmount: () =>
      setTimeout(() =>
        effect(() => {
          if (val(isOpen)) dialog.showModal();
          else dialog.close();
        })
      ),
    onclick: onTapOutside,
    class: dstr`pa0 br3 b--gray`,
    children: [
      m.Div({
        class: dstr` ${classNames}`,
        onclick: (e: Event) => e.stopPropagation(),
        children: content,
      }),
    ],
  }) as HtmlNode<HTMLDialogElement>;

  return dialog;
};
