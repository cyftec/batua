import { dpromise } from "@cyftech/signal";
import type { Account, Tag } from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchAllTags, allTags] = dpromise(() => db.tags.getAll());

const [addTag] = dpromise(async (tag: Tag) => {
  await db.tags.add(tag);
  await fetchAllTags();
});

const [editTag] = dpromise(async (tag: Tag) => {
  console.log(tag);
  await db.tags.put(tag);
  await fetchAllTags();
});

const [deleteTag] = dpromise(async (tagName: Tag["name"]) => {
  await db.tags.delete(tagName);
  await fetchAllTags();
});

export { allTags, addTag, deleteTag, editTag, fetchAllTags };
