import { areObjectsEqual } from "@cyftech/immutjs";
import { derived, dprops, dstring, effect, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { TagCategory, type Tag as TagModel } from "../../@libs/common";
import { Dialog, DropDown, Icon, Tag, TextBox } from "../../@libs/elements";
import { TAG_CATEGORIES } from "../../@libs/storage/localdb/setup/initial-data/tags-and-categories";

type TagEditorProps = {
  isOpen: boolean;
  tag: TagModel;
  allCategories: TagCategory[];
  onSaveNew: (newTag: TagModel) => void;
  onUpdate: (newTag: TagModel) => void;
  onDelete: (newTag: TagModel) => void;
  onMerge: (newTag: TagModel, oldTag: TagModel) => void;
  onCancel: () => void;
};

export const TagEditor = component<TagEditorProps>(
  ({
    isOpen,
    tag,
    allCategories,
    onSaveNew,
    onUpdate,
    onDelete,
    onMerge,
    onCancel,
  }) => {
    const error = signal("");
    const editingTag = signal(tag.value);
    const { name, category } = dprops(editingTag);

    const cancelEditing = () => {
      onCancel();
    };

    const updateTag = () => {
      if (tag && areObjectsEqual(editingTag.value, tag.value || {})) {
        error.value = `No change in original tag`;
        return;
      }
      onUpdate(editingTag.value);
    };

    return Dialog({
      isOpen: isOpen,
      header: derived(() => (tag ? `Edit tag '${tag.value.name}'` : ``)),
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
    });
  }
);
