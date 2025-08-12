import { Structured } from "../../_kvdb";
import { TimePeriod } from "../../controllers/transforms";
import { Tag } from "./tag";

export type Budget = Structured<{
  title: string;
  period: TimePeriod;
  amount: number;
  allOf: Tag[];
  oneOf: Tag[];
}>;
