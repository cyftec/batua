import { component, m } from "@mufw/maya";
import { Button } from "../../@libs/elements";
import { goToAccountCreatePage } from "../../@libs/common/utils";

type AccountsProps = {};

export const Accounts = component<AccountsProps>(({}) => {
  return m.Div({
    children: [
      m.Div("accounts list"),
      Button({
        onTap: goToAccountCreatePage,
        cssClasses: "pv2 ph3",
        children: "Create new account",
      }),
    ],
  });
});
