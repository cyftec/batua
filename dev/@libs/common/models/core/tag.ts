import { CombinedTypeSeparator, ID } from "./common";

export type Tag = TagUI["name"];

/**
 *
 *
 * UI Models
 */
export type TagUI = {
  id: ID;
  name: string;
};
