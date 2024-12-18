import { appName } from "../../../@libs/config";

export const PREFS_KEYS = {
  localCurrency: `${appName}-local-currency`,
  dbInitPhase: `${appName}-db-init-phase`,
} as const;
