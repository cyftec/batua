import { type Component, m } from "@maya/core";
import { dstr, source, val } from "@maya/signal";
import { type Tag as TagModel } from "../../@libs/common";
import { Dialog, DropDown, Icon, Tag } from "../../@libs/ui-kit";

type EditableTagProps = {
  tag: TagModel;
};

export const EditableTag: Component<EditableTagProps> = ({ tag }) => {
  const isEditorDialogOpen = source(false);

  const cancelEditing = () => {
    isEditorDialogOpen.value = false;
  };

  return m.Span([
    Dialog({
      isOpen: isEditorDialogOpen,
      header: dstr`Edit tag '${val(tag).id}'`,
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
              Tag({ classNames: "ph3 pv2 mr4", label: val(tag).id }),
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
                options: Object.entries(TRANSACTION_CATEGORIES).map(
                  ([key, cat]) => {
                    return {
                      id: key,
                      label: cat.label,
                      isSelected: key === tag.type,
                    };
                  }
                ),
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
      label: val(tag).id,
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
};
