import { component, m } from "@mufw/maya";
import { Tag } from "../../@view/components";
import { Icon } from "../../@view/elements";

type TagCategoryProps = {
  cssClasses?: string;
  icon: string;
  title: string;
  tags: string[];
};

export const TagCategory = component<TagCategoryProps>(
  ({ cssClasses, icon, title, tags }) => {
    return m.Div({
      class: cssClasses,
      children: [
        m.Div({
          class: "flex items-center silver",
          children: [
            Icon({ iconName: icon, size: 14 }),
            m.Div({ class: "f7 ml2", children: title }),
          ],
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: tags,
            map: (tag, index) => {
              return Tag({
                cssClasses: "mr2 mt2",
                size: "small",
                state: "idle",
                children: tag,
              });
            },
          }),
        }),
      ],
    });
  }
);
