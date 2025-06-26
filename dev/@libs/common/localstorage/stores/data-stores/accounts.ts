import { Account, AccountUI, ID } from "../../../models/core";
import { createStore, parseObjectJsonString } from "../../core";
import { paymentMethodsStore } from "./payment-methods";

const lsValueToAccount = (lsValueString: string | null): Account | undefined =>
  parseObjectJsonString<Account>(lsValueString, "balance");
const accountToLsValue = (account: Account): string => JSON.stringify(account);
const accountToAccountUI = (id: ID, account: Account): AccountUI => {
  const paymentMethods = paymentMethodsStore.getAll(account.methods);
  if (account.methods.length && !paymentMethods.length)
    throw `Payment methods not found for these ids: ${account.methods}`;
  const accountUI: AccountUI = {
    ...account,
    id,
    methods: paymentMethods,
  };
  return accountUI;
};
const accountUiToAccount = (accountUI: AccountUI): Account => {
  const accountRecord: Account = {
    ...accountUI,
    methods: accountUI.methods.map((meth) => meth.id),
  };
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
