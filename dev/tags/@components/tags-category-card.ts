import { derived, dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { TagsCategory } from "../../@libs/common";
import { ListTile } from "../../@libs/components";
import { Tag, TextBox } from "../../@libs/elements";
import { addTag, allTags, editTag } from "../../@libs/stores/tags";
import { EditableTag } from "./editable-tag";

type TagsCategoryCardProps = {
  classNames?: string;
  category: TagsCategory;
};

export const TagsCategoryCard = component<TagsCategoryCardProps>(
  ({ classNames, category }) => {
    const tagAddInputText = signal("");
    const itemHoveringOver = signal(false);

    const onTagAdd = async (tagName: string) => {
      if (!tagName) return;
      console.log(`adding tag '${tagName}'`);
      tagAddInputText.value = tagName;
      tagAddInputText.value = "";
      await addTag({
        name: tagName,
        category: category.value.name,
      });
    };

    const onDragHoverEnd = () => (itemHoveringOver.value = false);

    const onItemDrop = (e) => {
      onDragHoverEnd();
      const tagName = e.dataTransfer?.getData("droppingTagName") || "";
      const droppedTag = allTags.value?.find((t) => t.name === tagName);
      if (
        !tagName ||
        !droppedTag ||
        droppedTag.category === category.value.name
      )
        return;

      editTag({
        ...droppedTag,
        category: category.value.name,
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
          class: "flex flex-wrap",
          children: m.For({
            subject: derived(() => category.value.tags),
            map: (tag) =>
              m.If({
                subject: category.value.isTagEditable,
                isTruthy: EditableTag({ tag }),
                isFalsy: Tag({
                  classNames: "ph3 pv2 mb3 mr3",
                  label: tag.name,
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
      }),
    });
  }
);
