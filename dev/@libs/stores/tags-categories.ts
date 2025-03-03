import { dpromise } from "@cyftech/signal";
import type { TagCategory } from "../common";
import { db } from "../storage/localdb/setup";

const [fetchAllTagCategories, allTagCategories] = dpromise(() =>
  db.tagCategories.getAll()
);

const [addTagCategory] = dpromise(async (category: TagCategory) => {
  await db.tagCategories.add(category);
  await fetchAllTagCategories();
});

const [editTagCategory] = dpromise(async (category: TagCategory) => {
  await db.tagCategories.put(category);
  await fetchAllTagCategories();
});

const [deleteTagCategory] = dpromise(
  async (categoryName: TagCategory["name"]) => {
    await db.tagCategories.delete(categoryName);
    await fetchAllTagCategories();
  }
);

export {
  addTagCategory,
  allTagCategories,
  deleteTagCategory,
  editTagCategory,
  fetchAllTagCategories,
};
