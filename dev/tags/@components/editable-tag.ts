import { component, m } from "@mufw/maya";
import { derived, dprops, dstring, effect, signal, val } from "@cyftech/signal";
import { type Tag as TagModel } from "../../@libs/common";
import { Dialog, DropDown, Icon, Tag, TextBox } from "../../@libs/elements";
import { TAG_CATEGORIES } from "../../@libs/storage/localdb/setup/initial-data/tags-and-categories";
import { areObjectsEqual } from "@cyftech/immutjs";

type EditableTagProps = {
  tag: TagModel;
};

export const EditableTag = component<EditableTagProps>(({ tag }) => {
  const isEditorDialogOpen = signal(false);
  const editingTag = signal(tag.value);
  const { name, category } = dprops(editingTag);

  const cancelEditing = () => {
    editingTag.value = tag.value;
    isEditorDialogOpen.value = false;
  };

  const updateTag = () => {
    if (areObjectsEqual(editingTag.value, tag.value)) {
      console.log(`No change`);
      return;
    }
    console.log(JSON.stringify(editingTag.value));
    isEditorDialogOpen.value = false;
  };

  const onTagDragStart = (e) => {};

  return m.Span([
    Dialog({
      isOpen: isEditorDialogOpen,
      header: dstring`Edit tag '${tag.value.name}'`,
      headerChild: Icon({
        className: "ba b--light-gray br-100 red",
        iconName: "delete",
        size: 22,
        onClick: () => alert(`delete`),
      }),
      prevLabel: "Cancel",
      nextLabel: "Save",
      onTapOutside: cancelEditing,
      onPrev: cancelEditing,
      onNext: updateTag,
      child: m.Div({
        class: "mnw5",
        children: [
          TextBox({
            classNames: "w-100 br3 b--gray mb3 ph3 pv2",
            text: name,
            onchange: (text) =>
              (editingTag.value = { ...editingTag.value, name: text.trim() }),
          }),
          DropDown({
            classNames: "w-100 br3 mb3 ph3 pv2",
            options: derived(() =>
              Object.values(TAG_CATEGORIES).map((cat) => ({
                id: cat.name,
                label: cat.name,
                isSelected: cat.name === category.value,
              }))
            ),
            onchange: (optionId) => {
              console.log(category.value);
              console.log(optionId);
              editingTag.value = {
                ...editingTag.value,
                category: optionId.trim(),
              };
            },
          }),
        ],
      }),
    }),
    m.Div({
      draggable: "true",
      ondragstart: (e) => {
        e.dataTransfer.setData("droppingTagName", tag.value.name);
        console.log(`dragging '${e.dataTransfer.getData("droppingTagName")}'`);
      },
      children: Tag({
        classNames: "ph3 pv2 mb3 mr3 cursor-move",
        label: tag.value.name,
        iconClassNames: "ml2 silver f7",
        iconName: "edit",
        iconHint: "Edit tag",
        iconSize: 16,
        onIconClick: () => {
          console.log("opening modal");
          isEditorDialogOpen.value = true;
        },
      }),
    }),
  ]);
});
