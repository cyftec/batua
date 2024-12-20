import { type Component, m } from "@maya/core";
import { dstr, val } from "@maya/signal";
import { Icon } from "../ui-kit/icon";
import { pathname } from "../common";

type LinkData = {
  index: number;
  icon: string;
  label: string;
  href: string;
};

type NavbarProps = {
  classNames?: string;
  rightLink: LinkData;
  links: LinkData[];
  selectedLinkIndex: number;
};

export const Navbar: Component<NavbarProps> = ({
  classNames,
  rightLink,
  links,
  selectedLinkIndex,
}) => {
  return m.Div({
    class: dstr`bg-almost-white flex flex-column mnw5 vh-100 sticky left-0 top-0 bottom-0 ${classNames}`,
    // style: "flex-grow: 1; flex-basis: 0;",
    children: [
      m.A({
        class: "no-underline gray",
        href: pathname("/"),
        children: m.Div({
          class: "tc f3 ph4 pv3 ma4 bn br3 bg-white",
          children: "batua 1.04",
        }),
      }),
      m.Div({
        class: "h-100",
        children: m.For({
          items: links,
          map: (link, i) =>
            NavbarLink({
              classNames: "ml3 pa3 mv3",
              icon: link.icon,
              label: link.label,
              href: link.href,
              isSelected: val(selectedLinkIndex) === link.index,
            }),
        }),
      }),
      NavbarLink({
        classNames: "ml3 pa3 mb3",
        icon: val(rightLink).icon,
        label: val(rightLink).label,
        href: val(rightLink).href,
        isSelected: val(selectedLinkIndex) === val(rightLink).index,
      }),
    ],
  });
};

type NavbarLinkProps = {
  classNames?: string;
  icon: string;
  label: string;
  href: string;
  isSelected: boolean;
};

const NavbarLink: Component<NavbarLinkProps> = ({
  classNames,
  icon,
  label,
  href,
  isSelected,
}) =>
  m.Div({
    class: dstr`pointer hover-pop br4 br--left ${() =>
      val(isSelected) ? "bg-white" : ""} ${classNames}`,
    children: m.A({
      class: dstr`no-underline hover-black ${() =>
        val(isSelected) ? "black" : "silver"}`,
      href: href,
      children: m.Div({
        class: "flex items-center",
        children: [
          Icon({
            size: 22,
            iconName: icon,
          }),
          m.Div({
            class: "f5 pl3",
            children: label,
          }),
        ],
      }),
    }),
  });
