import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "./@libs/components";

export default HTMLPage({
  body: NavScaffold({
    header: "Transactions",
    content: m.Div({
      children: ["List of Transactions"],
    }),
  }),
});
