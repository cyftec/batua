import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "../../../@libs/components";

export default HTMLPage({
  body: NavScaffold({
    header: "Add new payment method",
    content: m.Div({
      children: ["Add new payment method"],
    }),
  }),
});
