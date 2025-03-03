import { INITIAL_DATA } from "./initial-data";

export const DB_NAME = "batua";
export const DB_VERSION = 1;
export const DB_CONFIG = {
  accounts: {
    keyPathsShorthand: "name",
    indices: [],
    initialData: INITIAL_DATA.ACCOUNTS,
  },
  paymentMethods: {
    keyPathsShorthand: "name",
    indices: [],
    initialData: INITIAL_DATA.PAYMENT_METHODS,
  },
  tagCategories: {
    keyPathsShorthand: "name",
    indices: [],
    initialData: INITIAL_DATA.TAG_CATEGORIES,
  },
  tags: {
    keyPathsShorthand: "name",
    indices: [{ category: "category|multiEntry" } as const],
    initialData: INITIAL_DATA.TAGS,
  },
  payments: {
    keyPathsShorthand: "id",
    indices: [
      { amount: "amount|multiEntry" } as const,
      { currencyCode: "currencyCode|multiEntry" } as const,
      { account: "account|multiEntry" } as const,
      { paymentMethod: "paymentMethod|multiEntry" } as const,
      { type: "type|multiEntry" } as const,
    ],
    initialData: INITIAL_DATA.PAYMENTS,
  },
  transactions: {
    keyPathsShorthand: "id",
    indices: [
      { date: "date|multiEntry" } as const,
      { createdAt: "createdAt|multiEntry" } as const,
      { modifiedAt: "modifiedAt|multiEntry" } as const,
      { title: "title|multiEntry" } as const,
      { payments: "payments|multiEntry" } as const,
      { tags: "tags|multiEntry" } as const,
    ],
    initialData: INITIAL_DATA.TRANSACTIONS,
  },
  budgets: {
    keyPathsShorthand: "name",
    indices: [],
    initialData: INITIAL_DATA.BUDGETS,
  },
} as const;
