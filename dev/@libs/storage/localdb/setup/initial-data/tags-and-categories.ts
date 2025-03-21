import type { TagDB, TagCategory } from "../../../../common";

export const NECESSITY_CATEGORY_ID = crypto.randomUUID();
export const UNCATEGORISED_CATEGORY_ID = crypto.randomUUID();
export const COMMUTE_CATEGORY_ID = crypto.randomUUID();
export const TRIPS_CATEGORY_ID = crypto.randomUUID();
export const SHOPS_CATEGORY_ID = crypto.randomUUID();
export const PRODUCTS_CATEGORY_ID = crypto.randomUUID();
export const ENTERTAINMENT_CATEGORY_ID = crypto.randomUUID();
export const SUBSCRIPTION_CATEGORY_ID = crypto.randomUUID();

export const ESSENTIAL_TAG_ID = crypto.randomUUID();
export const GROCERY_TAG_ID = crypto.randomUUID();
export const STATIONERY_TAG_ID = crypto.randomUUID();
export const EDUCATION_TAG_ID = crypto.randomUUID();
export const HOMENKITCHEN_TAG_ID = crypto.randomUUID();
export const NETFLIX_TAG_ID = crypto.randomUUID();
export const HOTSTAR_TAG_ID = crypto.randomUUID();
export const STANDUP_TAG_ID = crypto.randomUUID();
export const MOVIES_TAG_ID = crypto.randomUUID();
export const TEST_TAG_ID = crypto.randomUUID();
export const DUMMY_EXPENSE_TAG_ID = crypto.randomUUID();

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: NECESSITY_CATEGORY_ID,
    isCategoryEditable: 0,
    isTagEditable: 0,
    name: "Necessity of transaction",
    icon: "priority_high",
  },
  {
    id: UNCATEGORISED_CATEGORY_ID,
    isCategoryEditable: 0,
    isTagEditable: 1,
    name: "Not Categorized",
    icon: "warning",
  },
  {
    id: COMMUTE_CATEGORY_ID,
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Commute & Transportation",
    icon: "commute",
  },
  {
    id: TRIPS_CATEGORY_ID,
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Trips & Hotels",
    icon: "luggage",
  },
  {
    id: SHOPS_CATEGORY_ID,
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Shops or Marketplace",
    icon: "storefront",
  },
  {
    id: PRODUCTS_CATEGORY_ID,
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Product Category",
    icon: "production_quantity_limits",
  },
  {
    id: crypto.randomUUID(),
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Product Brand",
    icon: "brand_family",
  },
  {
    id: crypto.randomUUID(),
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Relatives or Friends",
    icon: "family_restroom",
  },
  {
    id: crypto.randomUUID(),
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Location of transaction",
    icon: "location_on",
  },
  {
    id: crypto.randomUUID(),
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Time of transaction",
    icon: "routine",
  },
  {
    id: crypto.randomUUID(),
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Events, groups or situations",
    icon: "celebration",
  },
  {
    id: crypto.randomUUID(),
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Miscellaneous category",
    icon: "category",
  },
  {
    id: ENTERTAINMENT_CATEGORY_ID,
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Entertainment",
    icon: "attractions",
  },
  {
    id: SUBSCRIPTION_CATEGORY_ID,
    isCategoryEditable: 1,
    isTagEditable: 1,
    name: "Subscription",
    icon: "subscriptions",
  },
];

export const TAGS: TagDB[] = [
  {
    id: ESSENTIAL_TAG_ID,
    name: "essential",
    category: NECESSITY_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "maybeluxury",
    category: NECESSITY_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "luxury",
    category: NECESSITY_CATEGORY_ID,
  },
  {
    id: TEST_TAG_ID,
    name: "test",
    category: UNCATEGORISED_CATEGORY_ID,
  },
  {
    id: DUMMY_EXPENSE_TAG_ID,
    name: "dummyexpense",
    category: UNCATEGORISED_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "luttgaya",
    category: UNCATEGORISED_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "uber",
    category: COMMUTE_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "airbnb",
    category: TRIPS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "bookingdotcom",
    category: TRIPS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "decathlon",
    category: SHOPS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "amazon",
    category: SHOPS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "ikea",
    category: SHOPS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "grocery",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "apparel",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "gadgets",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "furniture",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "grooming",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "gifting",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "jewellery",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "stationery",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "books",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "gardening",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "sportsnfitness",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "treatment",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "vehicle",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "outing",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "softwareapp",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "appliances",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "education",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "petsupplies",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "diningout",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "homenkitchen",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "luggagenbags",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "toysngames",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "accessories",
    category: PRODUCTS_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "movies",
    category: ENTERTAINMENT_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "standupshows",
    category: ENTERTAINMENT_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "netflix",
    category: SUBSCRIPTION_CATEGORY_ID,
  },
  {
    id: crypto.randomUUID(),
    name: "hotstar",
    category: SUBSCRIPTION_CATEGORY_ID,
  },
];
