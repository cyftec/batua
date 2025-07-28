import { IDKey } from "../../../kvdb";
import { TimePeriod } from "../../transforms";
import { Prettify, WithID } from "./common";
import { TagUI } from "./tag";

export type Budget = {
  title: string;
  period: TimePeriod;
  amount: number;
  oneOf: TagUI[IDKey][];
  allOf: TagUI[IDKey][];
};

/**
 *
 *
 * UI Models
 */

export type BudgetUI = Prettify<
  WithID<
    Omit<Budget, "oneOf" | "allOf"> & {
      oneOf: TagUI[];
      allOf: TagUI[];
    }
  >
>;

/**
 *
 *
 * DATABASE's INITIAL DATA CONSTANTS
 */
