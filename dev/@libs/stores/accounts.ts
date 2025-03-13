import { derived, dpromise } from "@cyftech/signal";
import {
  CURRENCIES,
  Currency,
  ID,
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

const [addAccount] = dpromise(async (account: AccountUI) => {
  const acc: AccountDB = { ...account, currency: account.currency.code };
  await db.accounts.add(acc);
  await fetchAllAccounts();
});

const [editAccount] = dpromise(async (account: AccountUI) => {
  const acc: AccountDB = { ...account, currency: account.currency.code };
  await db.accounts.put(acc);
  await fetchAllAccounts();
});

const [deleteAccount] = dpromise(async (accountId: ID) => {
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
