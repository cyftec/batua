import { Component, m } from "@maya/core";
import { drstr } from "@maya/signal";
import { Icon } from "./icon";

type SectionTitleProps = {
  classNames?: string;
  iconName: string;
  label: string;
};

export const SectionTitle = Component<SectionTitleProps>(
  ({ classNames, iconName, label }) =>
    m.H2({
      class: drstr`flex items-center mid-gray ${classNames}`,
      children: [
        Icon({
          size: 28,
          className: "b mr3",
          iconName: iconName,
        }),
        m.Text(label),
      ],
    })
);
