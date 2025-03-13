import { type BudgetDB } from "../../../../common";
import {
  ESSENTIAL_TAG_ID,
  GROCERY_TAG_ID,
  STATIONERY_TAG_ID,
  EDUCATION_TAG_ID,
  HOMENKITCHEN_TAG_ID,
  NETFLIX_TAG_ID,
  HOTSTAR_TAG_ID,
  STANDUP_TAG_ID,
  MOVIES_TAG_ID,
} from "./tags-and-categories";

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

export const BUDGETS: BudgetDB[] = [
  {
    id: crypto.randomUUID(),
    name: "Monthly household expense",
    limit: 15000,
    spend: 0,
    startDate: startOfMonth,
    endDate: endOfMonth,
    currency: "INR",
    tags: [
      ESSENTIAL_TAG_ID,
      GROCERY_TAG_ID,
      STATIONERY_TAG_ID,
      EDUCATION_TAG_ID,
      HOMENKITCHEN_TAG_ID,
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Entertainment Budget",
    limit: 1000,
    spend: 0,
    startDate: startOfMonth,
    endDate: endOfMonth,
    currency: "INR",
    tags: [NETFLIX_TAG_ID, HOTSTAR_TAG_ID, STANDUP_TAG_ID, MOVIES_TAG_ID],
  },
];
