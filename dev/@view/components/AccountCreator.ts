import { component, m } from "@mufw/maya";
import { populateInitialData } from "../../@controller/common/localstorage";
import { Button, Modal } from "../elements";

type AccountCreatorProps = {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
};

export const AccountCreator = component<AccountCreatorProps>(
  ({ isOpen, onClose, onDone }) => {
    const onStartAfresh = () => {
      populateInitialData();
      onDone();
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
                children: "Start afresh",
                onTap: onStartAfresh,
              }),
              Button({
                cssClasses: "pv2 ph3 ml2 b themecol",
                children: "Load backup",
                onTap: onStartAfresh,
              }),
            ],
          }),
        ],
      }),
    });
  }
);
