import { Children, component, m } from "@maya/core";
import { dstr } from "@maya/signal";

type ModalProps = {
  classNames?: string;
  isOpen: boolean;
  content: Children;
  onTapOutside?: () => void;
};

export const Modal = component<ModalProps>(
  ({ classNames, isOpen, content, onTapOutside }) => {
    return m.Div({
      class: dstr`bg-gray-70 z-9999 absolute absolute--fill ${() =>
        isOpen?.value ? "db" : "dn"}`,
      onclick: onTapOutside,
      children: [
        m.Div({
          class: dstr`bg-white pa3 ba br3 b--transparent ${classNames}`,
          style: `
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
          `,
          onclick: (e) => e.stopPropagation(),
          children: content,
        }),
      ],
    });
  }
);
