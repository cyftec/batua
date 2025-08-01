import { WithID } from "../../_kvdb";
import { TimePeriod } from "../../state/transforms";
import { Prettify } from "./common";
import { Tag } from "./tag";

export type BudgetRaw = {
  title: string;
  period: TimePeriod;
  amount: number;
  allOf: Tag[];
  oneOf: Tag[];
};

/**
 *
 *
 * UI Models
 */

export type Budget = Prettify<WithID<BudgetRaw>>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */
