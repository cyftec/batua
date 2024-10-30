import { Component, drstr, m } from "@maya/core";

type LinkData = {
  index: number;
  icon: string;
  label: string;
  href: string;
};

type NavbarProps = {
  rightLink: LinkData;
  links: LinkData[];
  selectedLinkIndex: number;
};

type NavbarLink = {
  className?: string;
  icon: string;
  label: string;
  href: string;
  isSelected: boolean;
};

const NavbarLink = Component<NavbarLink>(
  ({ className, icon, label, href, isSelected }) =>
    m.A({
      href: href,
      class: drstr`no-underline f7 pa3 mnw4 pointer ${() =>
        isSelected.value ? "bg-white mb1 black" : "silver"} ${className}`,
      children: m.Div({
        class: "flex flex-column items-center",
        children: [
          m.Span({
            class: "material-symbols-rounded",
            style: "font-size: 28px",
            children: m.Text(icon.value),
          }),
          m.Div({
            class: "f7 pt1",
            children: m.Text(label.value),
          }),
        ],
      }),
    })
);

export const Navbar = Component<NavbarProps>(
  ({ rightLink, links, selectedLinkIndex }) => {
    console.log(selectedLinkIndex.value);
    return m.Div({
      class: "sticky left-0 right-0 bottom-0 bg-light-gray",
      children: [
        m.Div({
          class: "confined flex justify-between",
          children: [
            m.Div({
              class: "flex items-center",
              children: m.For({
                items: links,
                map: (link) =>
                  NavbarLink({
                    icon: link.icon,
                    label: link.label,
                    href: link.href,
                    isSelected: selectedLinkIndex.value === link.index,
                  }),
              }),
            }),
            NavbarLink({
              icon: rightLink.value.icon,
              label: rightLink.value.label,
              href: rightLink.value.href,
              isSelected: selectedLinkIndex.value === rightLink.value.index,
            }),
          ],
        }),
      ],
    });
  }
);
