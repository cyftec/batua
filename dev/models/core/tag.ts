import { newUnstructuredRecord, Unstructured } from "../../_kvdb";

/**
 *
 *
 * UI Models
 */
export type Tag = Unstructured<string>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */

export const INITIAL_TAGS: Tag[] = [
  newUnstructuredRecord("expense"),
  newUnstructuredRecord("earning"),
  newUnstructuredRecord("transfer"),
  newUnstructuredRecord("balanceupdate"),
  newUnstructuredRecord("initialbalance"),
  newUnstructuredRecord("interest"),
  newUnstructuredRecord("notrace"),
  newUnstructuredRecord("purchase"),
  newUnstructuredRecord("unsettled"),
  newUnstructuredRecord("waiveoff"),
  newUnstructuredRecord("salary"),
  newUnstructuredRecord("sale"),
  newUnstructuredRecord("interest"),
  newUnstructuredRecord("find"),
  newUnstructuredRecord("restructure"),
  newUnstructuredRecord("settlement"),
  newUnstructuredRecord("lend"),
  newUnstructuredRecord("borrow"),
  newUnstructuredRecord("uber"),
  newUnstructuredRecord("airbnb"),
  newUnstructuredRecord("bookingdotcom"),
  newUnstructuredRecord("decathlon"),
  newUnstructuredRecord("amazon"),
  newUnstructuredRecord("ikea"),
  newUnstructuredRecord("grocery"),
  newUnstructuredRecord("apparel"),
  newUnstructuredRecord("gadgets"),
  newUnstructuredRecord("furniture"),
  newUnstructuredRecord("grooming"),
  newUnstructuredRecord("gifting"),
  newUnstructuredRecord("jewellery"),
  newUnstructuredRecord("stationery"),
  newUnstructuredRecord("books"),
  newUnstructuredRecord("gardening"),
  newUnstructuredRecord("sportsnfitness"),
  newUnstructuredRecord("treatment"),
  newUnstructuredRecord("vehicle"),
  newUnstructuredRecord("outing"),
  newUnstructuredRecord("subscription"),
  newUnstructuredRecord("appliances"),
  newUnstructuredRecord("education"),
  newUnstructuredRecord("petsupplies"),
  newUnstructuredRecord("diningout"),
  newUnstructuredRecord("foodorder"),
  newUnstructuredRecord("homenkitchen"),
  newUnstructuredRecord("luggagenbags"),
  newUnstructuredRecord("toysngames"),
  newUnstructuredRecord("accessories"),
  newUnstructuredRecord("movies"),
  newUnstructuredRecord("standupshows"),
  newUnstructuredRecord("netflix"),
  newUnstructuredRecord("hotstar"),
];
