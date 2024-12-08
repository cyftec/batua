import { Component, m } from "@maya/core";
import { MOCK, TRANSACTION_CATEGORIES } from "../../@libs/common";
import { Tag } from "../../@libs/ui-kit";
import { ListTile, SectionTitle } from "../../@libs/widgets";
import { EditableTag } from "./editable-tag";

type TagsSectionProps = {
  title: string;
  categories: string[];
};

export const TagsSection: Component<TagsSectionProps> = ({
  title,
  categories,
}) => {
  return m.Div({
    children: [
      SectionTitle({
        classNames: "mb3 pb2",
        label: title,
      }),
      m.Div({
        class: "nl4 flex flex-wrap",
        children: m.For({
          items: categories,
          map: (category) =>
            ListTile({
              classNames: "ba bw1 b--near-white ml4 mb4",
              titleIconName: TRANSACTION_CATEGORIES[category].icon,
              title: TRANSACTION_CATEGORIES[category].label,
              subtitle: "",
              child: m.Div({
                class: "flex flex-wrap",
                children: m.For({
                  items: MOCK.TAGS.filter((t) => t.type === category),
                  map: (tag) =>
                    m.Span(
                      m.If({
                        condition: tag.isEditable,
                        then: () => EditableTag({ tag }),
                        otherwise: () =>
                          Tag({
                            classNames: "ph3 pv2 mb3 mr3",
                            label: tag.name,
                          }),
                      })
                    ),
                }),
              }),
            }),
        }),
      }),
    ],
  });
};
