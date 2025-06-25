import { component } from "@mufw/maya";
import { Modal } from "../elements/Modal";

type AccountCreatorProps = {};

export const AccountCreator = component<AccountCreatorProps>(() => {
  return Modal({
    isOpen: false,
    content: undefined,
  });
});
