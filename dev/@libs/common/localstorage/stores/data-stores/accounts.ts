import {
  Account,
  ACCOUNT_TYPE,
  AccountUI,
  getTypeData,
  ID,
} from "../../../models/core";
import { getStore, parseObjectJsonString } from "../../core";
import { PREFIX } from "./common";
import { usersStore } from "./users";

const lsValueToAccount = (lsValueString: string | null): Account | undefined =>
  parseObjectJsonString<Account>(lsValueString, "owner");
const accountToLsValue = (account: Account): string => JSON.stringify(account);
const accountToAccountUI = (id: ID, account: Account): AccountUI => {
  const accOwner = usersStore.get(account.owner);
  if (!accOwner) throw `User not found for user id: ${account.owner}`;
  const accountUI: AccountUI = {
    ...account,
    id,
    type: getTypeData(ACCOUNT_TYPE, account.type),
    owner: accOwner,
  };
  return accountUI;
};
const accountUiToAccount = (accountUI: AccountUI): Account => {
  const accountRecord: Account = {
    ...accountUI,
    type: accountUI.type.key,
    owner: accountUI.owner.id,
  };
  delete accountRecord["id"];
  return accountRecord;
};

export const accountsStore = getStore<Account, AccountUI>(
  PREFIX.ACCOUNT,
  lsValueToAccount,
  accountToLsValue,
  accountToAccountUI,
  accountUiToAccount
);
