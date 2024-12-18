import type { Tag, TagCategory } from "../../../../common";

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: crypto.randomUUID(),
    icon: "warning",
    name: "Necessity of transaction",
  },
  { id: crypto.randomUUID(), icon: "account_balance", name: "Payemnt Source" },
  { id: crypto.randomUUID(), icon: "credit_card", name: "Payemnt Method" },
  {
    id: crypto.randomUUID(),
    icon: "commute",
    name: "Commute and Transportation",
  },
  { id: crypto.randomUUID(), icon: "luggage", name: "Travel" },
  { id: crypto.randomUUID(), icon: "storefront", name: "Shop or Marketplace" },
  {
    id: crypto.randomUUID(),
    icon: "production_quantity_limits",
    name: "Product Category",
  },
  { id: crypto.randomUUID(), icon: "brand_family", name: "Product Brand" },
  {
    id: crypto.randomUUID(),
    icon: "family_restroom",
    name: "Relatives or Friends",
  },
  {
    id: crypto.randomUUID(),
    icon: "location_on",
    name: "Location of transaction",
  },
  { id: crypto.randomUUID(), icon: "routine", name: "Time of transaction" },
  {
    id: crypto.randomUUID(),
    icon: "celebration",
    name: "Events, groups or situations",
  },
  { id: crypto.randomUUID(), icon: "dangerous", name: "Not categorized" },
  { id: crypto.randomUUID(), icon: "category", name: "Miscellaneous category" },
  { id: crypto.randomUUID(), icon: "attractions", name: "Entertainment" },
  { id: crypto.randomUUID(), icon: "subscriptions", name: "Subscription" },
];

export const TAGS: Tag[] = [
  {
    id: crypto.randomUUID(),
    name: "essential",
    isEditable: 0,
    category: "Necessity of transaction",
  },
  {
    id: crypto.randomUUID(),
    name: "maybeluxary",
    isEditable: 0,
    category: "Necessity of transaction",
  },
  {
    id: crypto.randomUUID(),
    name: "luxary",
    isEditable: 0,
    category: "Necessity of transaction",
  },
  {
    id: crypto.randomUUID(),
    name: "uber",
    isEditable: 1,
    category: "Commute and Transportation",
  },
  {
    id: crypto.randomUUID(),
    name: "airbnb",
    isEditable: 1,
    category: "Travel",
  },
  {
    id: crypto.randomUUID(),
    name: "bookingdotcom",
    isEditable: 1,
    category: "Travel",
  },
  {
    id: crypto.randomUUID(),
    name: "decathlon",
    isEditable: 1,
    category: "Shop or Marketplace",
  },
  {
    id: crypto.randomUUID(),
    name: "amazon",
    isEditable: 1,
    category: "Shop or Marketplace",
  },
  {
    id: crypto.randomUUID(),
    name: "ikea",
    isEditable: 1,
    category: "Shop or Marketplace",
  },
  {
    id: crypto.randomUUID(),
    name: "grocery",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "apparel",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "gadgets",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "furniture",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "grooming",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "gifting",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "jewellery",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "stationery",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "books",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "gardening",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "sportsnfitness",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "treatment",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "vehicle",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "outing",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "softwareapp",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "appliances",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "education",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "petsupplies",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "diningout",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "homenkitchen",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "luggagenbags",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "toysngames",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "accessories",
    isEditable: 1,
    category: "Product Category",
  },
  {
    id: crypto.randomUUID(),
    name: "movies",
    isEditable: 1,
    category: "Entertainment",
  },
  {
    id: crypto.randomUUID(),
    name: "standupshows",
    isEditable: 1,
    category: "Entertainment",
  },
  {
    id: crypto.randomUUID(),
    name: "netflix",
    isEditable: 1,
    category: "Subscription",
  },
  {
    id: crypto.randomUUID(),
    name: "hotstar",
    isEditable: 1,
    category: "Subscription",
  },
];