import { dispose, op, tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type LabelProps = {
  cssClasses?: string;
  unpadded?: boolean;
  text: string;
};

export const Label = component<LabelProps>(({ cssClasses, unpadded, text }) => {
  const paddingCss = op(unpadded).ternary("pl0", "pl1");
  const classes = tmpl`mt2 pt1 mb1 f7 moon-gray ${paddingCss} ${cssClasses}`;

  return m.Div({
    onunmount: () => dispose(paddingCss, classes),
    class: classes,
    children: text,
  });
});
