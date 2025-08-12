import { DerivedSignal } from "@cyftech/signal";
import { DbRecord, DbRecordID } from "../../_kvdb";

export type NavbarLink = {
  label: string;
  icon: string;
  isSelected: boolean;
  href: string;
};

export type DataStore<T extends DbRecord<any>> = {
  initialize: () => void;
  list: DerivedSignal<T[]>;
  get newValue(): T;
  get: (itemId: DbRecordID) => T | undefined;
  find: (predicate: (item: T) => boolean) => T | undefined;
  filter: (predicate: (item: T) => boolean) => T[];
  save: (item: T) => T;
};

export type ItemEditor<T extends DbRecord<any>> = {
  initializeEditor: (
    editableItemId?: DbRecordID,
    initialItemData?: Partial<T>
  ) => void;
  editableItemTitle: DerivedSignal<string>;
  item: DerivedSignal<T>;
  itemProps: { [key in keyof T]: DerivedSignal<T[key]> };
  error: DerivedSignal<string>;
  onChange: (partialChange: Partial<T>) => void;
  onFormValidate: () => void;
  onSave: () => void;
};
