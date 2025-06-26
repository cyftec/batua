import { tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type LabelProps = {
  cssClasses?: string;
  text: string;
};

export const Label = component<LabelProps>(({ cssClasses, text }) => {
  return m.Div({
    class: tmpl`mt2 pt1 mb1 ml1 f7 silver ${cssClasses}`,
    children: text,
  });
});
