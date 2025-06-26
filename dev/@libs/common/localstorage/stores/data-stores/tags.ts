import { ID, Tag, TagUI } from "../../../models/core";
import { createStore } from "../../core";

const lsValueToTag = (lsValueString: string | null): Tag | undefined => {
  if (!lsValueString) return;
  return lsValueString;
};
const tagToLsValue = (tag: Tag): string => tag;
const tagToTagUI = (id: ID, tag: Tag): TagUI => ({ id, name: tag });
const tagUiToTag = (tagUI: TagUI): Tag => tagUI.name;

export const tagsStore = createStore<Tag, TagUI>(
  "tg_",
  lsValueToTag,
  tagToLsValue,
  tagToTagUI,
  tagUiToTag
);
