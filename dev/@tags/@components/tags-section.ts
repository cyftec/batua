import { type Component, m } from "@maya/core";
import { source } from "@maya/signal";
import { db } from "../../@libs/storage/localdb/setup";
import { Tag, TextBox } from "../../@libs/ui-kit";
import { ListTile, SectionTitle } from "../../@libs/widgets";
import { EditableTag } from "./editable-tag";

type TagsSectionProps = {
  title: string;
  categories: (keyof typeof TRANSACTION_CATEGORIES)[];
};

export const TagsSection: Component<TagsSectionProps> = ({
  title,
  categories,
}) => {
  const focusedCategoryTextbox = source<
    keyof typeof TRANSACTION_CATEGORIES | undefined
  >(undefined);
  const tagAddInputText = source("");

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
                  items: [].filter((t) => t.type === category),
                  n: ["NECESSITY", "PAYMENT_SOURCE", "PAYMENT_METHOD"].includes(
                    category
                  )
                    ? -1
                    : 1000,
                  nthChild: () =>
                    TextBox({
                      classNames: `inline-flex bn mb3 ph2`,
                      text: tagAddInputText,
                      placeholder: "add tag",
                      onchange: (value) => {
                        if (!value) return;
                        tagAddInputText.value = value;
                        tagAddInputText.value = "";
                        db.tags
                          .add({
                            id: value,
                            type: category,
                            isEditable: true,
                          })
                          .then(() => {
                            db.tags.get().then((result) => console.log(result));
                          });
                      },
                    }),
                  map: (tag) =>
                    m.Span(
                      m.If({
                        condition: tag.isEditable,
                        then: () => EditableTag({ tag }),
                        otherwise: () =>
                          Tag({
                            classNames: "ph3 pv2 mb3 mr3",
                            label: tag.id,
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
