import { db } from "./localdb/index.ts";
import { PREFERENCES } from "./preferences/index.ts";

export const STORAGE = {
  db,
  prefs: PREFERENCES,
};
