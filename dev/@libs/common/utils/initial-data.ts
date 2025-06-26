import { Account, ID, PaymentMethod } from "../models/core";

export const CASH_PAYMENT_METHOD: PaymentMethod = {
  isPermanent: 1,
  name: "Notes & Coins",
};

export const MARKET_ACCOUNT: Account = {
  isPermanent: 1,
  name: "Market",
  balance: Number.MAX_SAFE_INTEGER,
  vaultType: "mixed",
  figure: "Approx",
  type: "market",
  methods: [],
};

export const getCashAccount = (casPaymetnMethodID: ID): Account => ({
  isPermanent: 1,
  name: "Cash in wallet",
  balance: 1000,
  vaultType: "physical",
  figure: "Exact",
  type: "deposit",
  methods: [casPaymetnMethodID],
});
