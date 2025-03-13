import { derived, dpromise } from "@cyftech/signal";
import {
  CURRENCIES,
  Currency,
  type AccountDB,
  type AccountUI,
} from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchAllAccounts, accountsList] = dpromise(async () => {
  const accounts: AccountUI[] = (await db.accounts.getAll()).map((acc) => ({
    ...acc,
    currency: CURRENCIES.find((curr) => curr.code === acc.currency) as Currency,
  }));
  return accounts;
});

const allAccounts = derived(() => accountsList.value || []);

const [addAccount] = dpromise(async (account: AccountDB) => {
  await db.accounts.add(account);
  await fetchAllAccounts();
});

const [editAccount] = dpromise(async (account: AccountDB) => {
  await db.accounts.put(account);
  await fetchAllAccounts();
});

const [deleteAccount] = dpromise(async (accountId: AccountDB["id"]) => {
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
