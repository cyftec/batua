import { ID, User, UserUI } from "../../../models/core";
import { getStore, parseObjectJsonString } from "../../core";
import { PREFIX } from "./common";

const lsValueToUser = (lsValueString: string | null): User | undefined =>
  parseObjectJsonString<User>(lsValueString, "email");
const userToLsValue = (user: User): string => JSON.stringify(user);
const userToUserUI = (id: ID, user: User): UserUI => ({ ...user, id });
const userUiToUser = (userUI: UserUI): User => {
  const userRecord: User = { ...userUI };
  delete userRecord["id"];
  return userRecord;
};

export const usersStore = getStore<User, UserUI>(
  PREFIX.USER,
  lsValueToUser,
  userToLsValue,
  userToUserUI,
  userUiToUser
);
