import { derived, DerivedSignal, dpromise } from "@cyftech/signal";
import type { ID, TagCategory, TagCategoryUI } from "../common";
import { db } from "../storage/localdb/setup";

const [fetchAllTagCategories, allCategories] = dpromise(() =>
  db.tagCategories.getAll()
);
const allTagCategories: DerivedSignal<TagCategory[]> = derived(
  () => allCategories.value || []
);
const getTagCategory = (id?: ID): TagCategory | undefined =>
  allTagCategories.value.find((tc) => tc.id === id);

const [addTagCategory] = dpromise(async (category: TagCategory) => {
  await db.tagCategories.add(category);
  await fetchAllTagCategories();
});

const [editTagCategory] = dpromise(async (category: TagCategory) => {
  await db.tagCategories.put(category);
  await fetchAllTagCategories();
});

const [deleteTagCategory] = dpromise(async (categoryId: TagCategory["id"]) => {
  await db.tagCategories.delete(categoryId);
  await fetchAllTagCategories();
});

export {
  addTagCategory,
  allTagCategories,
  deleteTagCategory,
  editTagCategory,
  getTagCategory,
  fetchAllTagCategories,
};
