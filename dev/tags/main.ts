import { m } from "@maya/core";
import { Page, SectionTitle, Tag } from "../@libs/ui-kit";
import { MOCK } from "../@libs/common";

export default () =>
  Page({
    title: "Batua | Tags & Categories",
    headerTitle: "Categorise your transactions using tags",
    selectedTabIndex: 3,
    content: [
      SectionTitle({
        iconName: "thumbs_up_down",
        label: "Tags based on necessity of transaction",
      }),
      m.Div({
        class: "flex flex-wrap",
        children: m.For({
          items: MOCK.TAGS.filter((t) => t.type === "NECESSITY"),
          map: (tag) =>
            Tag({
              iconName: "close",
              classNames: "ph3 pv2 mb3 mr3",
              label: tag.name,
            }),
        }),
      }),
    ],
  });
