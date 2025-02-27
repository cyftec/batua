import { dpromise } from "@cyftech/signal";
import type { Account } from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchAccounts, accounts] = dpromise(() => db.accounts.getAll());

const [addAccount] = dpromise(async (account: Account) => {
  await db.accounts.add(account);
  await fetchAccounts();
});

const [editAccount] = dpromise(async (account: Account) => {
  await db.accounts.put(account);
  await fetchAccounts();
});

const [deleteAccount] = dpromise(async (accountId: Account["id"]) => {
  await db.accounts.delete(accountId);
  await fetchAccounts();
});

export { accounts, addAccount, deleteAccount, editAccount, fetchAccounts };
