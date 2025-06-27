import { dispose, tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../common/utils";
import { Icon } from "./Icon";

type CardButtonProps = {
  cssClasses?: string;
  onTap: () => void;
  icon: string;
  label: string;
};

export const CardButton = component<CardButtonProps>(
  ({ cssClasses, onTap, icon, label }) => {
    const btnClasses = tmpl`pa3 ba b--light-silver br4 flex items-center justify-center ${cssClasses}`;

    return m.Div({
      onunmount: () => dispose(btnClasses),
      onclick: handleTap(() => onTap()),
      class: btnClasses,
      children: m.Div({
        class: "flex flex-column items-center f7",
        children: [
          Icon({
            size: 22,
            cssClasses: "mr2 mb2",
            iconName: icon,
          }),
          label,
        ],
      }),
    });
  }
);
