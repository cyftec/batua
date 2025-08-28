import { Structured } from "@cyftec/kvdb";
import { TimePeriod } from "../../controllers/transforms";
import { Tag } from "./tag";

export type Budget = Structured<{
  title: string;
  period: TimePeriod;
  amount: number;
  allOf: Tag[];
  oneOf: Tag[];
}>;
