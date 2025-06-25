import { component, m } from "@mufw/maya";
import { Button } from "../../@libs/elements";
import { goToAccountCreatePage } from "../../@libs/common/utils";

type PeopleProps = {};

export const People = component<PeopleProps>(({}) => {
  return m.Div({
    children: [
      m.Div("People"),
      Button({
        onTap: goToAccountCreatePage,
        cssClasses: "pv2 ph3",
        children: "Add friend",
      }),
    ],
  });
});
