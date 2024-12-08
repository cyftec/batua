import { Account, PaymentMethod, Tag } from "../models";

type MockData = {
  ACCOUNTS: Account[];
  PAYMENT_METHODS: PaymentMethod[];
  TAGS: Tag[];
};

export const MOCK: MockData = {
  ACCOUNTS: [
    {
      id: "CASH",
      name: "Cash in Wallet",
      balance: 3587,
      currency: "INR",
    },
    {
      id: "ICICI_SAVINGS",
      accountId: "022901511014",
      name: "ICICI Savings Account",
      balance: 118495,
      currency: "INR",
    },
    {
      id: "HDFC_SAVINGS",
      accountId: "3600012345689",
      name: "HDFC Savings Account",
      balance: 835723,
      currency: "INR",
    },
    {
      id: "AXIS_SAVINGS",
      accountId: "549912345689",
      name: "Axis Savings Account",
      balance: 9423,
      currency: "INR",
    },
    {
      id: "AXIS_CREDIT",
      accountId: "549922228888",
      name: "Axis Credit Account",
      balance: 90000,
      currency: "INR",
    },
    {
      id: "SODEXO",
      accountId: "chnkrydv@sodexo.com",
      name: "Sodexo",
      balance: 2200,
      currency: "INR",
    },
  ],
  PAYMENT_METHODS: [
    {
      code: "COINS_NOTES",
      displayName: "Coins & Notes",
      defaultAccountId: "CASH",
      connectedAccountIds: ["CASH"],
    },
    {
      code: "GPAY",
      displayName: "Google Pay",
      uniqueId: "9852430671@okaxis",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"],
    },
    {
      code: "PHONEPE",
      displayName: "PhonePe",
      uniqueId: "9852430671@ybl",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"],
    },
    {
      code: "PAYTM",
      displayName: "Paytm",
      uniqueId: "9852430671@paytm",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS", "AXIS_SAVINGS"],
    },
    {
      code: "ICICI_DEBIT",
      displayName: "ICICI Debit Card",
      uniqueId: "4300111122223333",
      expiry: new Date(2028, 10),
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"],
    },
    {
      code: "AXIS_CREDIT",
      displayName: "AXIS Credit Card",
      uniqueId: "4300111122223333",
      expiry: new Date(2026, 3),
      defaultAccountId: "AXIS_CREDIT",
      connectedAccountIds: ["AXIS_CREDIT"],
    },
    {
      code: "ICICI_NET_BANKING",
      displayName: "ICICI Net Banking",
      defaultAccountId: "ICICI_SAVINGS",
      connectedAccountIds: ["ICICI_SAVINGS"],
    },
    {
      code: "HDFC_NET_BANKING",
      displayName: "HDFC Net Banking",
      defaultAccountId: "HDFC_SAVINGS",
      connectedAccountIds: ["HDFC_SAVINGS"],
    },
    {
      code: "SODEXO_COUPONS",
      displayName: "Sodexo Coupons",
      uniqueId: "chnkrydv@sodexo.com",
      expiry: new Date(2025, 0, 31),
      defaultAccountId: "SODEXO",
      connectedAccountIds: ["SODEXO"],
    },
  ],
  TAGS: [
    {
      name: "cash",
      type: "PAYMENT_SOURCE",
      isEditable: false,
    },
    {
      name: "icicibank",
      type: "PAYMENT_SOURCE",
      isEditable: false,
    },
    {
      name: "hdfcbank",
      type: "PAYMENT_SOURCE",
      isEditable: false,
    },
    {
      name: "axisbank",
      type: "PAYMENT_SOURCE",
      isEditable: false,
    },
    {
      name: "sodexo",
      type: "PAYMENT_SOURCE",
      isEditable: false,
    },
    {
      name: "coinsnnotes",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "gpay",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "phonepe",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "paytm",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "icicidebitcard",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "axiscreditcard",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "icicinetbanking",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "hdfcnetbanking",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "sodexocoupons",
      type: "PAYMENT_METHOD",
      isEditable: false,
    },
    {
      name: "essential",
      type: "NECESSITY",
      isEditable: false,
    },
    {
      name: "maybeluxary",
      type: "NECESSITY",
      isEditable: false,
    },
    {
      name: "luxary",
      type: "NECESSITY",
      isEditable: false,
    },
    {
      name: "uber",
      type: "COMMUTE",
      isEditable: true,
    },
    {
      name: "airbnb",
      type: "TRAVEL",
      isEditable: true,
    },
    {
      name: "bookingdotcom",
      type: "TRAVEL",
      isEditable: true,
    },
    {
      name: "decathlon",
      type: "SHOP_OR_MARKET",
      isEditable: true,
    },
    {
      name: "amazon",
      type: "SHOP_OR_MARKET",
      isEditable: true,
    },
    {
      name: "ikea",
      type: "SHOP_OR_MARKET",
      isEditable: true,
    },
    {
      name: "grocery",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "apparel",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "gadgets",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "furniture",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "grooming",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "gifting",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "jewellery",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "stationery",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "books",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "gardening",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "sportsnfitness",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "treatment",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "vehicle",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "outing",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "softwareapp",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "appliances",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "education",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "petsupplies",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "diningout",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "homenkitchen",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "luggagenbags",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "toysngames",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "accessories",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
    {
      name: "moviesnshows",
      type: "PRODUCT_CATEGORY",
      isEditable: true,
    },
  ],
};
