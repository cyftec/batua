export const TRANSACTION_CATEGORIES = {
  NECESSITY: { icon: "warning", label: "Necessity of transaction" },
  PAYMENT_SOURCE: { icon: "account_balance", label: "Payemnt Source" },
  PAYMENT_METHOD: { icon: "credit_card", label: "Payemnt Method" },
  COMMUTE: { icon: "commute", label: "Commute and Transportation" },
  TRAVEL: { icon: "luggage", label: "Travel, Trips or Treks" },
  SHOP_OR_MARKET: { icon: "storefront", label: "Shop or Marketplace" },
  PRODUCT_CATEGORY: {
    icon: "production_quantity_limits",
    label: "Product Category",
  },
  PRODUCT_BRAND: { icon: "brand_family", label: "Product Brand" },
  RELATIONSHIP: { icon: "family_restroom", label: "Relatives or Friends" },
  PLACE: { icon: "location_on", label: "Location of transaction" },
  TIME: { icon: "routine", label: "Time of transaction" },
  EVENT: { icon: "celebration", label: "Events, groups or situations" },
  UNCATEGORIZED: { icon: "dangerous", label: "Not categorized" },
  MISC: { icon: "category", label: "Miscellaneous category" },
} as const;
