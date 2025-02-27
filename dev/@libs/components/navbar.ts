import { component, m } from "@mufw/maya";
import { dstring, val } from "@cyftech/signal";
import { Icon } from "../elements/icon";

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

export const Navbar = component<NavbarProps>(
  ({ classNames, rightLink, links, selectedLinkIndex }) => {
    return m.Div({
      class: dstring`bg-almost-white flex flex-column mnw5 vh-100 sticky left-0 top-0 bottom-0 ${classNames}`,
      // style: "flex-grow: 1; flex-basis: 0;",
      children: [
        m.A({
          class: "flex items-center no-underline ma4",
          href: "/",
          children: [
            m.Img({
              class: "w2 h2 br3 mr3",
              src: "/assets/images/batua-logo.png",
            }),
            m.Div({
              class: "tc f4 bn br3 bg-white gray",
              children: [
                m.Span({
                  class: "mr3 f3",
                  children: "Batua",
                }),
                m.Span({
                  class: "f6",
                  children: "v1.04",
                }),
              ],
            }),
          ],
        }),
        m.Div({
          class: "h-100",
          children: m.For({
            subject: links,
            map: (link, i) =>
              NavbarLink({
                classNames: "ml3 pa3 mv3",
                icon: link.icon,
                label: link.label,
                href: link.href,
                isSelected: selectedLinkIndex.value === link.index,
              }),
          }),
        }),
        NavbarLink({
          classNames: "ml3 pa3 mb3",
          icon: rightLink.value.icon,
          label: rightLink.value.label,
          href: rightLink.value.href,
          isSelected: selectedLinkIndex.value === rightLink.value.index,
        }),
      ],
    });
  }
);

type NavbarLinkProps = {
  classNames?: string;
  icon: string;
  label: string;
  href: string;
  isSelected: boolean;
};

const NavbarLink = component<NavbarLinkProps>(
  ({ classNames, icon, label, href, isSelected }) =>
    m.Div({
      class: dstring`pointer hover-pop ${() =>
        isSelected.value
          ? "bg-white b ba br4 b--moon-gray"
          : ""} ${classNames}`,
      children: m.A({
        class: dstring`no-underline hover-black ${() =>
          isSelected.value ? "black" : "light-silver"}`,
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
    })
);
