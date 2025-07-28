import { dispose, tmpl, value } from "@cyftech/signal";
import { Child, Children, component, m } from "@mufw/maya";

type ScaffoldProps = {
  cssClasses?: string;
  header?: Children;
  content: Child;
  bottombar?: Children;
};

export const Scaffold = component<ScaffoldProps>(
  ({ cssClasses, header, content, bottombar }) => {
    const classes = tmpl`w6-ns ${cssClasses}`;
    const getHeaderFontSizeCss = () => {
      const headerVal = value(header);
      return typeof headerVal === "string" && (headerVal as string).length > 20
        ? "f2dot66"
        : "f2dot33";
    };
    const headerCss = tmpl`overflow-break-word sticky top-0 left-0 right-0 bg-inherit z-999 b pv3 mt2 ${getHeaderFontSizeCss}`;

    return m.Div({
      onunmount: () => dispose(classes, headerCss),
      class: "flex-ns justify-center-ns",
      children: m.Div({
        class: classes,
        children: [
          m.If({
            subject: header,
            isTruthy: () =>
              m.Div({
                class: headerCss,
                children: header,
              }),
          }),
          content,
          m.Div({ class: "pv6 mt5" }),
          m.If({
            subject: bottombar,
            isTruthy: () =>
              m.Div({
                class: "sticky bottom-0 left-0 right-0 z-9999",
                children: bottombar,
              }),
          }),
        ],
      }),
    });
  }
);
