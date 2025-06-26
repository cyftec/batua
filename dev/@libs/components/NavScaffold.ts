import { tmpl } from "@cyftech/signal";
import { Child, Children, component, m } from "@mufw/maya";
import { Scaffold } from "../elements";
import { NavBar } from "./NavBar";

type NavScaffoldProps = {
  cssClasses?: string;
  header?: Children;
  content: Child;
  navbarTop?: Child;
  hideNavbar?: boolean;
};

export const NavScaffold = component<NavScaffoldProps>(
  ({ cssClasses, header, content, navbarTop, hideNavbar }) => {
    return Scaffold({
      cssClasses: tmpl`ph3 bg-white ${cssClasses}`,
      header: header,
      content: content,
      bottombar: [
        m.If({
          subject: navbarTop,
          isTruthy: navbarTop as Child,
        }),
        m.If({
          subject: hideNavbar,
          isFalsy: NavBar({ cssClasses: "nl3 nr3 ph3" }),
        }),
      ],
    });
  }
);
