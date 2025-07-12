import { derive, dispose, op, tmpl } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";
import { handleTap } from "../common/utils";

type TagProps = {
  cssClasses?: string;
  children: Children;
  size: "large" | "medium" | "small";
  state: "selected" | "unselected" | "idle";
  onClick?: () => void;
};

export const Tag = component<TagProps>(
  ({ children, size, state, cssClasses, onClick }) => {
    const sizeCss = derive(() =>
      size.value === "large"
        ? "f5 br3 pa2"
        : size.value === "medium"
        ? "f6 br3 ph2 pv1"
        : "f8 fw5 br3 pa1"
    );
    const colorCss = op(state)
      .equals("unselected")
      .ternary("light-silver", "black");
    const borderCss = op(state)
      .equals("selected")
      .ternary("b--moon-gray", "b--transparent");
    const classes = tmpl`ba bw1 bg-near-white ${sizeCss} ${colorCss} ${borderCss} ${cssClasses}`;

    return m.Div({
      onunmount: () => dispose(classes, borderCss, colorCss, sizeCss),
      onclick: handleTap(onClick),
      class: classes,
      children: children,
    });
  }
);
