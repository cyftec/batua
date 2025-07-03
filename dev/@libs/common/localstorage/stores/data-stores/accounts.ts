import { Account, AccountUI, ID } from "../../../models/core";
import { createStore, parseObjectJsonString } from "../../core";

const lsValueToAccount = (lsValueString: string | null): Account | undefined =>
  parseObjectJsonString<Account>(lsValueString, "balance");

const accountToLsValue = (account: Account): string => JSON.stringify(account);

export const accountToAccountUI = (id: ID, account: Account): AccountUI => ({
  ...account,
  id,
});

export const accountUiToAccount = (accountUI: AccountUI): Account => {
  const accountRecord: Account = { ...accountUI };
  delete accountRecord["id"];
  return accountRecord;
};

export const accountsStore = createStore<Account, AccountUI>(
  "ac_",
  lsValueToAccount,
  accountToLsValue,
  accountToAccountUI,
  accountUiToAccount
);
