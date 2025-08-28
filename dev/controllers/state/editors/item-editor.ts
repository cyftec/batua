import { DbRecord, DbRecordID } from "@cyftec/kvdb";
import {
  derive,
  DerivedSignal,
  signal,
  SourceSignal,
  trap,
} from "@cyftech/signal";
import { DataStore, ItemEditor } from "../../../models/view-models";
import { areStringsSimilar } from "../../utils";

type StringOnlyFieldKeys<T extends DbRecord<any>> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export const getItemEditor = <T extends DbRecord<any>>(
  store: DataStore<T>,
  itemTitleField: StringOnlyFieldKeys<T>,
  validator: (item: T) => string
): ItemEditor<T> => {
  const _error = signal("");
  const _editedItem = signal<T>(store.newValue) as SourceSignal<
    Record<string, unknown>
  >;

  const _itemProps = trap(_editedItem).props;
  const _editableItemId = signal<DbRecordID>(0);
  const _editableItemTitle = signal("");

  const resetError = () => (_error.value = "");

  const _initializeEditor = (
    editableItemId: DbRecordID = 0,
    initialItemData?: Partial<T>
  ) => {
    if (initialItemData)
      (_editedItem as SourceSignal<Record<string, unknown>>).set({
        ...initialItemData,
      });

    if (editableItemId) {
      const editableItem = editableItemId
        ? store.get(editableItemId)
        : undefined;
      if (!editableItem)
        throw `Error fetching record with id - ${editableItemId}`;
      _editedItem.value = editableItem;
      _editableItemId.value = editableItem.id;
      _editableItemTitle.value = `${editableItem[itemTitleField]}`;
    }
  };

  const _onChange = (partialChange: Partial<T>) => {
    resetError();
    (_editedItem as SourceSignal<Record<string, unknown>>).set(partialChange);
  };

  const _onFormValidate = () => {
    let err = "";
    const itemTitle = (_editedItem.value as T)[itemTitleField] as string;
    const existing = store.find((pm) =>
      areStringsSimilar(pm[itemTitleField] as string, itemTitle)
    );
    if (existing)
      err = `A db record with similar title '${itemTitle}' already exists.`;
    err = validator(_editedItem.value as T);
    _error.value = err;
  };

  const _onItemSave = () => {
    const savedItem = store.save(_editedItem.value as T);
    _editedItem.value = savedItem;
  };

  return {
    initializeEditor: _initializeEditor,
    editableItemTitle: derive(() => _editableItemTitle.value),
    item: derive(() => _editedItem.value) as DerivedSignal<T>,
    itemProps: _itemProps as { [K in keyof T]: DerivedSignal<T[K]> },
    error: derive(() => _error.value),
    onChange: _onChange,
    onFormValidate: _onFormValidate,
    onSave: _onItemSave,
  } as const;
};
