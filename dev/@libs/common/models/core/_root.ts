// TODO: No need to work on below models now. Keep them for future use.

export const ACCOUNT = {
  people: {
    rel: "with name" as const,
    niteshagarwal: {},
    arindam: {},
  },
  savings: {
    rel: "with vault type" as const,
    physical: {},
    digital: {
      rel: "acc with name",
    },
  },
  loan: {
    rel: "of type" as const,
    personal: {},
    business: {},
    education: {},
    home: {},
    car: {},
    insurance: {},
  },
  investment: {
    rel: "of type" as const,
    stocks: {},
    bonds: {},
    mutualfunds: {},
    derivatives: {},
    etfs: {},
    structurednotes: {},
  },
};

export const money = {
  rel: "moved, involving" as const,
  multipleaccs: {
    rel: "as a txn of type" as const,
    transfer: {
      rel: "between accounts of same type, which is one of" as const,
      people: ACCOUNT.people,
      savings: ACCOUNT.savings,
      loan: ACCOUNT.loan,
      investment: ACCOUNT.investment,
    },
    settlement: {
      rel: "between my savings acc and acc of type" as const,
      people: ACCOUNT.people,
      loan: ACCOUNT.loan,
      investment: ACCOUNT.investment,
    },
    lend: {
      rel: "from my savings acc to acc of type" as const,
      people: ACCOUNT.people,
      investment: ACCOUNT.investment,
    },
    borrow: {
      rel: "from acc of type" as const,
      people: ACCOUNT.people,
      loan: ACCOUNT.loan,
    },
  },
  singleacc: {
    rel: "as a txn of type" as const,
    balanceupdate: {
      rel: "of any one of" as const,
      people: ACCOUNT.people,
      savings: ACCOUNT.savings,
      loan: ACCOUNT.loan,
      investment: ACCOUNT.investment,
    },
    credit: {
      rel: "to my savings acc of type" as const,
      people: ACCOUNT.people,
      savings: ACCOUNT.savings,
      loan: ACCOUNT.loan,
      investment: ACCOUNT.investment,
    },
    debit: {
      rel: "from my savings acc" as const,
    },
  },
};

export const TRADE = {
  income: {
    rel: "by a" as const,
    job: {},
    business: {},
  },
  win: {
    rel: "by a" as const,
    find: {},
    prize: {},
  },
  expense: {
    rel: "by a" as const,
    purchase: {},
    donation: {},
  },
  loss: {
    rel: "by a" as const,
    misplacement: {},
    penalty: {},
  },
};
