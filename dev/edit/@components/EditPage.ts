import { derive, op } from "@cyftech/signal";
import { Child, component } from "@mufw/maya";
import { HTMLPage, NavScaffold } from "../../@libs/components";
import { DialogActionButtons, Icon } from "../../@libs/elements";

type EditPageProps = {
  error: string;
  editableItemType: string;
  editableItemTitle: string;
  validateForm: () => void;
  onSave: () => void;
  onMount: (urlParams: URLSearchParams) => void;
  content: Child;
};

export const EditPage = component<EditPageProps>(
  ({
    error,
    editableItemType,
    editableItemTitle,
    validateForm,
    onSave,
    onMount,
    content,
  }) => {
    const headerLabel = derive(() =>
      editableItemTitle.value
        ? `Edit ${editableItemType.value.toLowerCase()} '${
            editableItemTitle.value
          }'`
        : `Add new ${editableItemType.value.toLowerCase()}`
    );
    const commitBtnLabel = op(editableItemTitle).ternary("Save", "Add");

    const goToPrevPage = () => {
      history.back();
    };

    const savePaymentMethod = () => {
      validateForm();
      if (error.value) return;
      onSave();
      goToPrevPage();
    };

    const onPageMount = () => {
      const params = new URL(window.location.href).searchParams;
      onMount(params);
    };

    return HTMLPage({
      onMount: onPageMount,
      body: NavScaffold({
        header: headerLabel,
        content: content,
        hideNavbar: true,
        navbarTop: DialogActionButtons({
          cssClasses: "sticky bottom-0 bg-near-white pv2 ph3 nl3 nr3",
          error: error,
          discardLabel: [
            Icon({ cssClasses: "nl2 mr2", iconName: "arrow_back" }),
            "Cancel",
          ],
          commitLabel: [
            Icon({ cssClasses: "nl3 mr2", iconName: commitBtnLabel }),
            commitBtnLabel,
          ],
          onDiscard: goToPrevPage,
          onCommit: savePaymentMethod,
        }),
      }),
    });
  }
);
