import { ID, Tag, TagUI } from "../../../models/core";
import { getStore } from "../../core";
import { PREFIX } from "./common";

const getTagFromLsValue = (lsValueString: string | null): Tag | undefined => {
  if (!lsValueString) return;
  return lsValueString;
};
const tagToLsValue = (tag: Tag): string => tag;
const tagToTagUI = (id: ID, tag: Tag): TagUI => ({ id, name: tag });
const tagUiToTag = (tagUI: TagUI): Tag => tagUI.name;

export const tagsStore = getStore<Tag, TagUI>(
  PREFIX.TAG,
  getTagFromLsValue,
  tagToLsValue,
  tagToTagUI,
  tagUiToTag
);
