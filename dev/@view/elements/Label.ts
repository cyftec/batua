import { dispose, op, tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type LabelProps = {
  cssClasses?: string;
  size?: "large" | "small";
  unpadded?: boolean;
  text: string;
};

export const Label = component<LabelProps>(
  ({ cssClasses, size, unpadded, text }) => {
    const paddingCss = op(unpadded).ternary("pl0", "pl1");
    const sizeCss = op(size).equals("large").ternary("f6", "f7");
    const classes = tmpl`mt2 pt1 mb1 light-silver ${paddingCss} ${sizeCss} ${cssClasses}`;

    return m.Div({
      onunmount: () => dispose(paddingCss, sizeCss, classes),
      class: classes,
      children: text,
    });
  }
);
