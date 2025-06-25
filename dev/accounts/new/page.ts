import { m } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "../../@libs/components";

export default HTMLPage({
  body: NavScaffold({
    header: "Add new account",
    content: m.Div({
      children: ["Add new account"],
    }),
  }),
});
