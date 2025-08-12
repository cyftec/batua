import { accountsStore } from "./accounts";
import { budgetsStore } from "./budgets";
import { paymentMethodsStore } from "./payment-methods";
import { paymentsStore } from "./payments";
import { tagsStore } from "./tags";
import { titlesStore } from "./titles";
import { txnsStore } from "./txns";

const _onInitialize = () => {
  accountsStore.initialize();
  budgetsStore.initialize();
  paymentMethodsStore.initialize();
  paymentsStore.initialize();
  tagsStore.initialize();
  titlesStore.initialize();
  txnsStore.initialize();
};

export const store = {
  initialize: _onInitialize,
  accounts: accountsStore,
  budgets: budgetsStore,
  paymentMethods: paymentMethodsStore,
  payments: paymentsStore,
  tags: tagsStore,
  titles: titlesStore,
  txns: txnsStore,
} as const;
