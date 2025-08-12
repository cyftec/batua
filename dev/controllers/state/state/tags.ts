import { db } from "../";
import { Tag } from "../../../models/data-models";
import { DataStore } from "../../../models/view-models";
import { getDataStore } from "./data-store";

const _newItem: Tag = {
  id: 0,
  value: "",
};

export const tagsStore: DataStore<Tag> = getDataStore(() => _newItem, db.tags);
