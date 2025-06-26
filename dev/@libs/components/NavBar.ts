import { compute, dispose, op, signal, tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { getNavbarRoutes } from "../common/transforms";
import { goToHref, handleTap } from "../common/utils";
import { Icon } from "../elements";

type NavBarProps = {
  cssClasses?: string;
};

export const NavBar = component<NavBarProps>(({ cssClasses }) => {
  const classes = tmpl`flex items-center justify-between pv3 bg-near-white ${cssClasses}`;
  const urlPathname = signal("/");
  const navLinks = compute(getNavbarRoutes, urlPathname);

  return m.Div({
    onmount: () => (urlPathname.value = location.pathname),
    onunmount: () => dispose(classes, navLinks),
    class: classes,
    children: m.For({
      subject: navLinks,
      map: (link) =>
        NavBarLink({
          label: link.label,
          icon: link.icon,
          isSelected: link.isSelected,
          href: link.href,
        }),
    }),
  });
});

type NavBarLinkProps = {
  cssClasses?: string;
  label: string;
  icon: string;
  isSelected: boolean;
  href: string;
};

export const NavBarLink = component<NavBarLinkProps>(
  ({ cssClasses, label, icon, isSelected, href }) => {
    const fontColor = op(isSelected).ternary("themecol b", "mid-gray");
    const classes = tmpl`pointer noselect flex flex-column items-center justify-center pb2dot5 ${fontColor} ${cssClasses}`;

    return m.Div({
      onunmount: () => dispose(fontColor, classes),
      class: classes,
      onclick: handleTap(() => goToHref(href.value)),
      children: [
        Icon({ size: 22, iconName: icon }),
        m.Div({ class: "f8 b pt1", children: label }),
      ],
    });
  }
);
