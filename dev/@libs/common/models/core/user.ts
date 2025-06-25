import { ID, NumBoolean } from "./common";

export type User = {
  isDeletable: NumBoolean;
  name: string;
  email?: string;
  type: "Self" | "Friend" | "World";
};

/**
 *
 *
 * UI Models
 */
export type UserUI = User & {
  id: ID;
};
