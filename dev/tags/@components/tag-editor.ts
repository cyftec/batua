import { areValuesEqual } from "@cyftech/immutjs";
import { derived, dprops, dstring, effect, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { ID, TagCategory, type TagUI } from "../../@libs/common";
import { Dialog, DropDown, Icon, TextBox } from "../../@libs/elements";
import { allTagCategories } from "../../@libs/stores/tags-categories";
import { allTags, deleteTag, editTag } from "../../@libs/stores/tags";

type TagEditorProps = {
  editableTag?: TagUI;
  onDone: () => void;
  onCancel: () => void;
};

export const TagEditor = component<TagEditorProps>(
  ({ editableTag, onDone, onCancel }) => {
    const isDeleteMode = signal(false);
    const dialogTitle = dstring`${() =>
      isDeleteMode.value ? "Delete" : "Edit"} tag '${() =>
      editableTag?.value?.name || ""}'`;
    const error = signal("");
    const isOpen = derived(() => !!editableTag?.value);
    const initTag: TagUI = {
      id: crypto.randomUUID(),
      name: "",
      category: {
        id: crypto.randomUUID(),
        icon: "",
        name: "",
        isCategoryEditable: 0,
        isTagEditable: 0,
      },
    };
    const editedTag = signal(editableTag?.value || initTag);

    const { name: editedTagName, category: editedTagCategoryId } =
      dprops(editedTag);
    const categoryOptions = derived(() => {
      const allCats = allTagCategories.value;
      const editedTagCat = editedTagCategoryId.value;
      if (!allCats.length || !editedTagCat) return [];
      return allCats.map((cat) => ({
        id: cat.id,
        label: cat.name,
        isSelected: cat.id === editedTagCat.id,
      }));
    });

    effect(() => {
      if (editableTag?.value) {
        console.log(editableTag.value);
        editedTag.value = editableTag.value;
      }
    });

    const onTagNameChange = (newName: string) => {
      error.value = "";
      editedTag.value = { ...editedTag.value, name: newName.trim() };
    };

    const onTagCategoryChange = (newCategoryId: string) => {
      error.value = "";
      editedTag.value = {
        ...editedTag.value,
        category: allTagCategories.value.find(
          (cat) => cat.id === newCategoryId
        ) as TagCategory,
      };
    };

    const resetEditor = () => {
      error.value = "";
      isDeleteMode.value = false;
    };

    const cancelEditing = () => {
      resetEditor();
      onCancel();
    };

    const onPrev = () => {
      if (isDeleteMode.value) {
        isDeleteMode.value = false;
        return;
      }
      cancelEditing();
    };

    const onUpdateTag = async () => {
      if (!editableTag?.value?.name) {
        error.value = `No tag to edit`;
        return;
      }
      await editTag(editedTag.value);
      console.log(
        `tag updated from '${JSON.stringify(
          editableTag?.value
        )}' to '${JSON.stringify(editedTag.value)}'`
      );
    };

    const onDeleteTag = async () => {
      await deleteTag(editedTag.value.id);
      console.log(`tag '${editableTag?.value?.name}' permanently deleted`);
      onDone();
    };

    const onSubmit = () => {
      if (isDeleteMode.value) {
        onDeleteTag();
      } else {
        if (areValuesEqual(editableTag?.value, editedTag.value)) {
          error.value = `No change in original tag`;
          console.log(error.value);
          return;
        }

        if (
          editableTag?.value?.id !== editedTag.value.id &&
          allTags.value.find((t) => t.name === editedTag.value.name)
        ) {
          error.value = "A tag with same name already exists.";
          return;
        }
        onUpdateTag();
      }

      onDone();
      resetEditor();
    };

    return Dialog({
      classNames: "w-34",
      isOpen: isOpen,
      header: dialogTitle,
      headerChild: Icon({
        className: dstring`ba br-100 pa2 ${() =>
          isDeleteMode.value ? "b--silver" : "red b--light-red"}`,
        iconName: derived(() => (isDeleteMode.value ? "edit" : "delete")),
        size: 22,
        onClick: () => (isDeleteMode.value = !isDeleteMode.value),
      }),
      prevLabel: derived(() =>
        isDeleteMode.value ? "Back to editing" : "Cancel"
      ),
      nextLabel: derived(() => (isDeleteMode.value ? "Yes, delete" : "Update")),
      onTapOutside: cancelEditing,
      onPrev: onPrev,
      onNext: onSubmit,
      child: m.Div({
        children: m.If({
          subject: isDeleteMode,
          isFalsy: m.Div({
            class: "mnw5",
            children: [
              TextBox({
                classNames: "w-100 br3 ba b--light-gray mb3 ph3 pv2",
                text: editedTagName,
                onchange: onTagNameChange,
              }),
              DropDown({
                classNames: "w-100 br3 mb3 ph3 pv2",
                options: categoryOptions,
                onchange: onTagCategoryChange,
              }),
              m.If({
                subject: error,
                isTruthy: m.Span({
                  class: "red",
                  children: error,
                }),
              }),
            ],
          }),
          isTruthy: m.Div({
            class: "mnw5",
            children: [
              m.Span({
                children: dstring`Are you sure you want to delete '${() =>
                  editableTag?.value?.name}' permanently?`,
              }),
            ],
          }),
        }),
      }),
    });
  }
);
