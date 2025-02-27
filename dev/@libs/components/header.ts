import { component, m } from "@mufw/maya";

type HeaderProps = {
  title: string;
};

export const Header = component<HeaderProps>(({ title }) =>
  m.Div({
    class: "sticky left-0 top-0 right-0 pv4 f2 fw1 black bg-white",
    children: title,
  })
);
