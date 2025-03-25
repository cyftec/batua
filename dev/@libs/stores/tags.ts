import { derived, dpromise } from "@cyftech/signal";
import type { TagDB, TagCategory, TagUI, ID } from "../../@libs/common";
import { db } from "../storage/localdb/setup";
import { allTagCategories, fetchAllTagCategories } from "./tags-categories";

const [fetchAllTags, allTagsList] = dpromise(async () => {
  const allTags = await db.tags.getAll();
  if (!allTagCategories.value.length) await fetchAllTagCategories();
  const uiTags: TagUI[] = allTags.map((tag) => {
    return {
      ...tag,
      category: allTagCategories.value.find(
        (tc) => tc.id === tag.category
      ) as TagCategory,
    };
  });

  return uiTags;
});

const allTags = derived(() => allTagsList.value || []);

const findTag = async (tagID: ID) => {
  if (!tagID) throw `Invalid tag-ID for finding the tag`;
  return await db.tags.get(tagID);
};

const [addTag] = dpromise(async (tag: TagUI) => {
  const dbTag: TagDB = {
    ...tag,
    category: tag.category.id,
  };
  await db.tags.add(dbTag);
  await fetchAllTags();
});

const [editTag] = dpromise(async (tag: TagUI) => {
  const dbTag: TagDB = {
    ...tag,
    category: tag.category.id,
  };
  await db.tags.put(dbTag);
  await fetchAllTags();
});

const [deleteTag] = dpromise(async (tagId: ID) => {
  await db.tags.delete(tagId);
  await fetchAllTags();
});

export { findTag, addTag, allTags, deleteTag, editTag, fetchAllTags };
