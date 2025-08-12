import { derive, signal } from "@cyftech/signal";
import { DbRecord, DbRecordID } from "../../../_kvdb";
import { Table } from "../../../_kvdb/table";
import { DataStore } from "../../../models/view-models";

export const getDataStore = <T extends DbRecord<any>>(
  newItem: () => T,
  table: Table<T>
): DataStore<T> => {
  const _itemsList = signal<T[]>([]);

  const _onInitialize = () => {
    _itemsList.value = table.get();
  };

  const _getPm = (id: DbRecordID): T | undefined => {
    return table.get(id);
  };

  const _findItem = (predicate: (item: T) => boolean): T | undefined =>
    table.find(predicate);

  const _filter = (predicate: (item: T) => boolean): T[] =>
    table.filter(predicate);

  const _saveItem = (item: T): T => {
    const savedItem = table.put(item);
    _onInitialize();
    return savedItem;
  };

  return {
    initialize: _onInitialize,
    get newValue() {
      return newItem();
    },
    list: derive(() => _itemsList.value),
    get: _getPm,
    find: _findItem,
    filter: _filter,
    save: _saveItem,
  };
};
