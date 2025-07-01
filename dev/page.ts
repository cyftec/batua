import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "./@libs/components";
import { Button, Icon } from "./@libs/elements";
import { goToEditTxnPage } from "./@libs/common/utils";

export default HTMLPage({
  body: NavScaffold({
    header: "Transactions",
    content: m.Div({
      children: ["List of Transactions"],
    }),
    navbarTop: m.Div({
      class: "w-100 flex justify-end",
      children: Button({
        onTap: goToEditTxnPage,
        cssClasses: "flex items-center pa3 mb3",
        children: [
          Icon({ cssClasses: "mr1", iconName: "add" }),
          "Add transaction",
        ],
      }),
    }),
  }),
});
