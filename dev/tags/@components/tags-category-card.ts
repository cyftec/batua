import { derived, dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { TagCategoryUI, TagUI } from "../../@libs/common";
import { ListTile } from "../../@libs/components";
import { Tag, TextBox } from "../../@libs/elements";
import { addTag, allTags, editTag } from "../../@libs/stores/tags";

type TagsCategoryCardProps = {
  classNames?: string;
  category: TagCategoryUI;
  onTagEdit: (tag: TagUI) => void;
};

export const TagsCategoryCard = component<TagsCategoryCardProps>(
  ({ classNames, category, onTagEdit }) => {
    const error = signal("");
    const tagAddInputText = signal("");
    const itemHoveringOver = signal(false);

    const onTagAdd = async (tagName: string) => {
      error.value = "";
      if (!tagName) return;
      console.log(`adding tag '${tagName}'`);
      const foundTag = allTags.value.find((t) => t.name === tagName);
      if (foundTag) {
        const categoryLabel =
          foundTag.category.name === category.value.name
            ? "this"
            : `'${foundTag.category}'`;
        error.value = `A tag with same name exist in ${categoryLabel} category`;
        return;
      }

      tagAddInputText.value = tagName;
      tagAddInputText.value = "";
      const newTag: TagUI = {
        id: crypto.randomUUID(),
        name: tagName,
        category: category.value,
      };
      await addTag(newTag);
    };

    const onDragHoverEnd = () => (itemHoveringOver.value = false);

    const onItemDrop = (e) => {
      error.value = "";
      onDragHoverEnd();
      const tagName = e.dataTransfer?.getData("droppingTagName") || "";
      const droppedTag = allTags.value?.find((t) => t.name === tagName);
      if (
        !tagName ||
        !droppedTag ||
        droppedTag.category.name === category.value.name
      )
        return;

      editTag({
        ...droppedTag,
        category: category.value,
      });
    };

    return m.Div({
      ondragover: !category.value.isTagEditable
        ? undefined
        : (e) => {
            itemHoveringOver.value = true;
            e.preventDefault();
          },
      ondragleave: onDragHoverEnd,
      ondragend: onDragHoverEnd,
      ondrop: !category.value.isTagEditable ? undefined : onItemDrop,
      children: ListTile({
        classNames: dstring`mr3 mt3 w-100 ${() =>
          itemHoveringOver.value && category.value.isTagEditable
            ? "b--black-90 b--dashed"
            : ""} ${classNames}`,
        titleIconName: category.value.icon,
        title: category.value.name,
        subtitle: "",
        child: m.Div({
          children: [
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: derived(() => category.value.tags),
                map: (tag) =>
                  m.Div({
                    class: "mb3 mr3",
                    draggable: derived(() =>
                      category.value.isTagEditable ? "true" : "false"
                    ),
                    ondragstart: (e) =>
                      e.dataTransfer.setData("droppingTagName", tag.name),
                    children: Tag({
                      classNames: dstring`ph3 pv2 ${() =>
                        category.value.isTagEditable ? "cursor-move" : ""}`,
                      label: tag.name,
                      iconClassNames: "ml2 silver f7",
                      iconName: derived(() =>
                        category.value.isTagEditable ? "edit" : ""
                      ),
                      iconHint: "Edit tag",
                      iconSize: 16,
                      onIconClick: () => onTagEdit(tag),
                    }),
                  }),
                n: category.value.isTagEditable ? Infinity : -1,
                nthChild: TextBox({
                  classNames: `inline-flex bn mb3 ph2`,
                  text: tagAddInputText,
                  placeholder: "add tag",
                  onchange: onTagAdd,
                }),
              }),
            }),
            m.If({
              subject: error,
              isTruthy: m.Div({
                class: "mb3 red",
                children: error,
              }),
            }),
          ],
        }),
      }),
    });
  }
);
