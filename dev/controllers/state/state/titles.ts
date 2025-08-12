import { db } from "..";
import { Title } from "../../../models/data-models";
import { DataStore } from "../../../models/view-models";
import { getDataStore } from "./data-store";

const _newItem: Title = {
  id: 0,
  value: "",
};

export const titlesStore: DataStore<Title> = getDataStore(
  () => _newItem,
  db.titles
);
