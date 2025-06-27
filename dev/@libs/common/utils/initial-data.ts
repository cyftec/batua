import { Account, ID, PaymentMethod } from "../models/core";

export const NET_BANKING_PAYMENT_METHOD: PaymentMethod = {
  isPermanent: 1,
  name: "Net Banking",
  mode: "digital",
};

export const CASH_PAYMENT_METHOD: PaymentMethod = {
  isPermanent: 1,
  name: "Notes & Coins",
  mode: "physical",
};

export const MARKET_ACCOUNT: Account = {
  isPermanent: 1,
  name: "Market",
  balance: Number.MAX_SAFE_INTEGER,
  type: "market",
  methods: [],
};

export const getCashAccount = (casPaymetnMethodID: ID): Account => ({
  isPermanent: 1,
  name: "Cash in wallet",
  balance: 0,
  vault: "physical",
  type: "asset",
  methods: [casPaymetnMethodID],
});
