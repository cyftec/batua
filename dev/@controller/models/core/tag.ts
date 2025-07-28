import { PrimitiveExtendedRecord } from "../../../@kvdb";

export type Tag = string;

/**
 *
 *
 * UI Models
 */
export type TagUI = PrimitiveExtendedRecord<Tag>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const INITIAL_TAGS: Tag[] = [
  "expense",
  "earning",
  "transfer",
  "balanceupdate",
  "initialbalance",
  "interest",
  "notrace",
  "purchase",
  "unsettled",
  "waiveoff",
  "salary",
  "sale",
  "interest",
  "find",
  "restructure",
  "settlement",
  "lend",
  "borrow",
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
