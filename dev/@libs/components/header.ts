import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type HeaderProps = {
  classNames?: string;
  title: string;
};

export const Header = component<HeaderProps>(({ title, classNames }) =>
  m.Div({
    class: dstring`sticky left-0 top-0 right-0 pv4 f2 fw2 black bg-pale ${classNames}`,
    children: title,
  })
);
