import { type Budget } from "../../../../common";

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
export const BUDGETS: Budget[] = [
  {
    name: "Monthly household expense",
    limit: 15000,
    spend: 0,
    startDate: startOfMonth,
    endDate: endOfMonth,
    currency: "INR",
    tags: ["essential", "grocery", "stationery", "education", "homenkitchen"],
  },
  {
    name: "Entertainment Budget",
    limit: 1000,
    spend: 0,
    startDate: startOfMonth,
    endDate: endOfMonth,
    currency: "INR",
    tags: ["netflix", "hotstar", "standupshows", "movies"],
  },
];
