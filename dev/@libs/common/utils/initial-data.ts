import {
  ExpenseAccount,
  ID,
  PaymentMethod,
  Tag,
  WorldAccount,
} from "../models/core";

export const WORLD_ACCOUNT: WorldAccount = {
  isPermanent: 1,
  name: "World",
  balance: Number.MAX_SAFE_INTEGER,
  uniqueId: undefined,
  type: "World",
  vault: undefined,
};

export const CASH_EXPENSE_ACCOUNT: ExpenseAccount = {
  isPermanent: 1,
  name: "Cash in wallet",
  balance: 0,
  vault: "physical",
  type: "Expense",
};

export const NET_BANKING_PAYMENT_METHOD: PaymentMethod = {
  isPermanent: 1,
  name: "Net Banking",
  type: "digital",
  slave: false,
  accounts: [],
};

export const getCashPaymentMethod = (cashExpenseAccID: ID): PaymentMethod => ({
  isPermanent: 1,
  name: "Notes & Coins",
  type: "physical",
  slave: false,
  accounts: [cashExpenseAccID],
});

export const TAGS: Tag[] = [
  "uber",
  "airbnb",
  "bookingdotcom",
  "decathlon",
  "amazon",
  "ikea",
  "grocery",
  "apparel",
  "gadgets",
  "furniture",
  "grooming",
  "gifting",
  "jewellery",
  "stationery",
  "books",
  "gardening",
  "sportsnfitness",
  "treatment",
  "vehicle",
  "outing",
  "subscription",
  "appliances",
  "education",
  "petsupplies",
  "diningout",
  "foodorder",
  "homenkitchen",
  "luggagenbags",
  "toysngames",
  "accessories",
  "movies",
  "standupshows",
  "netflix",
  "hotstar",
];
