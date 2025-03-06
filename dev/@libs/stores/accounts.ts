import { dpromise } from "@cyftech/signal";
import type { Account } from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchAllAccounts, allAccounts] = dpromise(() => db.accounts.getAll());

const [addAccount] = dpromise(async (account: Account) => {
  await db.accounts.add(account);
  await fetchAllAccounts();
});

const [editAccount] = dpromise(async (account: Account) => {
  await db.accounts.put(account);
  await fetchAllAccounts();
});

const [deleteAccount] = dpromise(async (accountId: Account["id"]) => {
  await db.accounts.delete(accountId);
  await fetchAllAccounts();
});

export {
  allAccounts,
  addAccount,
  deleteAccount,
  editAccount,
  fetchAllAccounts,
};
