import { component, m } from "@mufw/maya";
import { derived, dstring, val } from "@cyftech/signal";
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
      children: [
        m.A({
          class: "flex items-center no-underline ma3 pa3 br4 hover-pop",
          href: "/",
          children: [
            m.Img({
              class: "h3rem w3rem mr2 br3",
              src: "/assets/images/batua-logo.png",
            }),
            m.Div({
              class: "ml1 black fw2",
              children: [
                m.Div({
                  class: "tl f4 bn br3",
                  children: [
                    m.Span({
                      class: "mr2 f2",
                      children: "batua",
                    }),
                    m.Span({
                      class: "f7 silver",
                      // children: "v0.0.1",
                    }),
                  ],
                }),
                m.Div({
                  class: "f6 fw3 mb1 silver",
                  children: "Money Tracker App",
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
                classNames: "mh3 mb3",
                icon: link.icon,
                label: link.label,
                href: link.href,
                isSelected: selectedLinkIndex.value === link.index,
              }),
          }),
        }),
        NavbarLink({
          classNames: "mh3 mb3",
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
      class: dstring`br4 ba ${() =>
        isSelected.value
          ? "bg-white b--light-gray black"
          : "b--pale light-silver hover-pop"} ${classNames}`,
      children: m.A({
        class: dstring`no-underline hover-black ${() =>
          isSelected.value ? "black fw4 no-pointer" : "fw3 light-silver"}`,
        href: derived(() => (isSelected.value ? undefined : href.value)),
        children: m.Div({
          class: "pa3 flex items-center",
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
