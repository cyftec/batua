import {
  Account,
  COMBINED_TYPE_SEPARATOR,
  ID,
  PaymentMethod,
  PaymentMode,
  User,
} from "../models/core";

const WORLD: User = {
  isDeletable: 0,
  name: "World",
  type: "World",
};
const getSelfUser = (selfUserName: string, selfUserEmail: string): User => ({
  isDeletable: 0,
  name: selfUserName,
  email: selfUserEmail,
  type: "Self",
});
export const getInitialUsers = (
  selfUserName: string,
  selfUserEmail: string
): User[] => [WORLD, getSelfUser(selfUserName, selfUserEmail)];

const getWorldMoneyAccount = (worldUserId: ID): Account => ({
  isDeletable: 0,
  name: "World's overall money",
  type: "other",
  owner: worldUserId,
  balance: {
    amount: Infinity,
    type: "Exact",
  },
});
const getSelfCashAccount = (selfUserId: ID): Account => ({
  isDeletable: 0,
  name: "Cash in wallet",
  type: "savings",
  owner: selfUserId,
  balance: {
    amount: 1000,
    type: "Exact",
  },
});
export const getInitialAccounts = (
  worldUserId: ID,
  selfUserId: ID
): Account[] => [
  getWorldMoneyAccount(worldUserId),
  getSelfCashAccount(selfUserId),
];

export const getInitialPaymentMethods = (): PaymentMethod[] => {
  const CASH_PAYMENT_METHOD: PaymentMethod = {
    isDeletable: 0,
    name: "Notes & Coins",
  };
  return [CASH_PAYMENT_METHOD];
};

export const getInitialPaymentModes = (
  selfCashAccId: ID,
  selfCashPaymentMethodId: ID
): PaymentMode[] => {
  const CASH_PAYMENT_MODE: PaymentMode = `${selfCashAccId}${COMBINED_TYPE_SEPARATOR}${selfCashPaymentMethodId}`;
  return [CASH_PAYMENT_MODE];
};
