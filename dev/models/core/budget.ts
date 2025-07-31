import { IDKey } from "../../_kvdb";
import { TimePeriod } from "../../state/transforms";
import { Prettify, WithID } from "./common";
import { Tag } from "./tag";

export type BudgetRaw = {
  title: string;
  period: TimePeriod;
  amount: number;
  allOf: Tag[IDKey][];
  oneOf: Tag[IDKey][];
};

/**
 *
 *
 * UI Models
 */

export type Budget = Prettify<
  WithID<
    Omit<BudgetRaw, "oneOf" | "allOf"> & {
      allOf: Tag[];
      oneOf: Tag[];
    }
  >
>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */
