import { component, m } from "@mufw/maya";
import { derived, DerivedSignal, signal } from "@cyftech/signal";
import { db } from "../../@libs/storage/localdb/setup";
import { Tag, TextBox } from "../../@libs/elements";
import { ListTile, SectionTitle } from "../../@libs/components";
import { EditableTag } from "./editable-tag";
import { Tag as TagType, TagCategory, ID } from "../../@libs/common";
import { TAG_CATEGORIES } from "../../@libs/storage/localdb/setup/initial-data/tags-and-categories";
import { allTags, fetchAllTags } from "../../@libs/stores/tags";

type TagsSectionProps = {
  title: string;
  categories: TagCategory[];
};

export const TagsSection = component<TagsSectionProps>(
  ({ title, categories }) => {
    const tagAddInputText = signal("");
    const categoriesWithTags = derived(() => {
      if (!allTags.value || !categories.value.length) return [];
      const allTagsList = allTags.value;

      const cwtList = categories.value
        .map((tc) => {
          return {
            ...tc,
            tags: allTagsList.filter((t) => t.category === tc.name),
          };
        })
        .filter((cwt) => cwt.tags.length);

      return cwtList;
    });

    return m.Div({
      onmount: fetchAllTags,
      class: "mb5",
      children: [
        SectionTitle({
          label: title,
        }),
        m.Div({
          class: "flex flex-wrap",
          children: m.For({
            subject: categoriesWithTags,
            map: (categoryWithTags) =>
              ListTile({
                classNames: "mr3 mt3",
                titleIconName: categoryWithTags.icon,
                title: categoryWithTags.name,
                subtitle: "",
                child: m.Div(
                  m.If({
                    subject: derived(() => (allTags.value || []).length),
                    isTruthy: m.Div({
                      class: "flex flex-wrap",
                      children: m.For({
                        subject: categoryWithTags.tags,
                        n: [
                          "Necessity of transaction",
                          "Payemnt Source",
                          "Payemnt Method",
                        ].includes(categoryWithTags.name)
                          ? -1
                          : Infinity,
                        nthChild: TextBox({
                          classNames: `inline-flex bn mb3 ph2`,
                          text: tagAddInputText,
                          placeholder: "add tag",
                          onchange: async (value) => {
                            if (!value) return;
                            console.log(`adding tag '${value}'`);
                            tagAddInputText.value = value;
                            tagAddInputText.value = "";
                            await db.tags.add({
                              id: crypto.randomUUID() as ID,
                              name: value,
                              isEditable: 1,
                              category: categoryWithTags.name,
                            });
                            await fetchAllTags();
                            console.log(allTags.value);
                          },
                        }),
                        map: (tag) =>
                          m.If({
                            subject: tag.isEditable,
                            isTruthy: EditableTag({ tag }),
                            isFalsy: Tag({
                              classNames: "ph3 pv2 mb3 mr3",
                              label: tag.name,
                            }),
                          }),
                      }),
                    }),
                  })
                ),
              }),
          }),
        }),
      ],
    });
  }
);
