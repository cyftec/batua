import { component, m } from "@mufw/maya";
import { Modal } from "../elements/Modal";
import { Button } from "../elements";
import { populateInitialData } from "../common/localstorage";

type AccountCreatorProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AccountCreator = component<AccountCreatorProps>(
  ({ isOpen, onClose }) => {
    const onStartAfresh = () => {
      populateInitialData();
      onClose();
    };

    return Modal({
      cssClasses: "bn w-30-ns",
      isOpen: isOpen,
      onTapOutside: onClose,
      content: m.Div({
        class: "pa3 f5",
        children: [
          m.Div({
            class: "mb3 b f4",
            children: "Start afresh or load backup?",
          }),
          m.Div({
            class: "mb4",
            children: [
              `
              All the data and the achievements associated with this habit will be lost forever
              with this action, and cannot be reversed.
              `,
              m.Br({}),
              m.Br({}),
              `
              Are you sure, you want to DELETE this habit permanently?
              `,
            ],
          }),
          m.Div({
            class: "flex items-center justify-between f6",
            children: [
              Button({
                cssClasses: "pv2 ph3 mr1 b",
                children: "Start fresh",
                onTap: onStartAfresh,
              }),
              Button({
                cssClasses: "pv2 ph3 ml2 b app-theme-color",
                children: "Load backup",
                onTap: onClose,
              }),
            ],
          }),
        ],
      }),
    });
  }
);
