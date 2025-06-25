import { tmpl } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { Scaffold } from "../elements";
import { NavBar } from "./NavBar";

type NavScaffoldProps = {
  cssClasses?: string;
  header?: Child;
  content: Child;
  navbarTop?: Child;
};

export const NavScaffold = component<NavScaffoldProps>(
  ({ cssClasses, header, content, navbarTop }) => {
    return Scaffold({
      cssClasses: tmpl`ph3 ${cssClasses}`,
      header: header,
      content: content,
      bottombar: [
        m.If({
          subject: navbarTop,
          isTruthy: navbarTop as Child,
        }),
        NavBar({ cssClasses: "nl3 nr3 ph3" }),
      ],
    });
  }
);
