import { openDb } from "../libs/open-db";
import { DB_CONFIG, DB_NAME, DB_VERSION } from "./db-config";
import { handleUpgradeV1 } from "./handle-version-upgrade";

export const db = openDb(DB_NAME, DB_VERSION, DB_CONFIG, handleUpgradeV1);
