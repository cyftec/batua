import { PlainExtendedRecord } from "../../localstorage/core";

export type Tag = string;

/**
 *
 *
 * UI Models
 */
export type TagUI = PlainExtendedRecord<Tag>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const INITIAL_TAGS: Tag[] = [
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
