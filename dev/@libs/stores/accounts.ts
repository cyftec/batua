import { derived, dpromise } from "@cyftech/signal";
import {
  getCurrencyFromCode,
  ID,
  type AccountDB,
  type AccountUI,
} from "../../@libs/common";
import { db } from "../storage/localdb/setup";

const [fetchAllAccounts, accountsList] = dpromise(async () => {
  const accounts: AccountUI[] = (await db.accounts.getAll()).map((acc) => ({
    ...acc,
    currency: getCurrencyFromCode(acc.currency),
  }));
  return accounts;
});
const allAccounts = derived(() => accountsList.value || []);

const findAccount = async (accountID: ID): Promise<AccountUI | undefined> => {
  if (!accountID) throw `Invalid account-ID for finding the account`;
  const foundAcc = await db.accounts.get(accountID);
  if (!foundAcc) return;

  return {
    ...foundAcc,
    currency: getCurrencyFromCode(foundAcc.currency),
  };
};

const addAccount = async (account: AccountUI) => {
  const acc: AccountDB = { ...account, currency: account.currency.code };
  await db.accounts.add(acc);
  await fetchAllAccounts();
};

const editAccount = async (account: AccountUI) => {
  const acc: AccountDB = { ...account, currency: account.currency.code };
  console.log(`putting updated account`, acc);
  await db.accounts.put(acc);
  await fetchAllAccounts();
};

const addBalanceToAccount = async (accountID: ID, amount: number) => {
  const acc = await findAccount(accountID);
  if (!acc) throw `Account doesn't exist for give account ID`;

  const updatedAccountBalance = acc.balance + amount;
  const updatedNewAccount: AccountUI = {
    ...acc,
    balance: updatedAccountBalance,
  };
  await editAccount(updatedNewAccount);
};

const deleteAccount = async (accountId: ID) => {
  await db.accounts.delete(accountId);
  await fetchAllAccounts();
};

export {
  addAccount,
  allAccounts,
  deleteAccount,
  addBalanceToAccount,
  editAccount,
  fetchAllAccounts,
  findAccount,
};
