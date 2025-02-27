import { component, m } from "@mufw/maya";
import { dstring, signal, val } from "@cyftech/signal";
import { type Tag as TagModel } from "../../@libs/common";
import { Dialog, DropDown, Icon, Tag } from "../../@libs/elements";
import { TAG_CATEGORIES } from "../../@libs/storage/localdb/setup/initial-data/tags-and-categories";

type EditableTagProps = {
  tag: TagModel;
};

export const EditableTag = component<EditableTagProps>(({ tag }) => {
  const isEditorDialogOpen = signal(false);

  const cancelEditing = () => {
    isEditorDialogOpen.value = false;
  };

  return m.Span([
    Dialog({
      isOpen: isEditorDialogOpen,
      header: dstring`Edit tag '${tag.value.name}'`,
      prevLabel: "Cancel",
      nextLabel: "Save",
      onTapOutside: cancelEditing,
      onPrev: cancelEditing,
      onNext: cancelEditing,
      child: m.Div({
        class: "mnw5",
        children: [
          m.Div({
            class: "flex items-center justify-between mb3",
            children: [
              Tag({ classNames: "ph3 pv2 mr4", label: tag.value.name }),
              m.Span([
                Icon({
                  className: "ml3 pa2 ba b--light-gray br-100",
                  iconName: "edit",
                  size: 22,
                  onClick: () => {},
                }),
                Icon({
                  className: "ml3 pa2 ba b--light-gray br-100 red",
                  iconName: "delete",
                  size: 22,
                  onClick: () => {},
                }),
              ]),
            ],
          }),
          m.Span({
            children: [
              DropDown({
                classNames: "mr3 pa2 br2",
                options: Object.entries(TAG_CATEGORIES).map(([key, cat]) => {
                  return {
                    id: key,
                    label: cat.name,
                    isSelected: key === tag.type,
                  };
                }),
                onchange: function (optionId: string): void {
                  // throw new Error("Function not implemented.");
                },
              }),
              "Change category",
            ],
          }),
        ],
      }),
    }),
    Tag({
      classNames: "ph3 pv2 mb3 mr3",
      label: tag.value.name,
      iconClassNames: "ml2",
      iconName: "edit",
      iconHint: "Edit tag",
      iconSize: 20,
      onIconClick: () => {
        console.log("opening modal");
        isEditorDialogOpen.value = true;
      },
    }),
  ]);
});
