import { derived, dpromise } from "@cyftech/signal";
import type { Account, Tag } from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchAllTags, allTagsList] = dpromise(() => db.tags.getAll());

const allTags = derived(() => allTagsList.value || []);

const [addTag] = dpromise(async (tag: Tag) => {
  await db.tags.add(tag);
  await fetchAllTags();
});

const [editTag] = dpromise(async (tag: Tag) => {
  await db.tags.put(tag);
  await fetchAllTags();
});

const [deleteTag] = dpromise(async (tagId: Tag["id"]) => {
  await db.tags.delete(tagId);
  await fetchAllTags();
});

export { allTags, addTag, deleteTag, editTag, fetchAllTags };
