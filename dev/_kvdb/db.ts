import { KvStore, LOCALSTORAGE_AS_KVSTORE } from "./kv-stores";
import { DbUnsupportedType, TableKey } from "./models";
import { createTable, Table } from "./table";

export type Schema = {
  [Tabl in string]: {
    key: TableKey;
    structure: readonly [any, any];
    foreignKeyMappings?: Record<string, string>;
    dbToJsTypeMappings?: Record<string, DbUnsupportedType>;
  };
};

export type DB<DbSchema extends Schema> = {
  [TableName in keyof DbSchema]: Table<
    DbSchema[TableName]["structure"][0],
    DbSchema[TableName]["structure"][1]
  >;
};

export const createDb = <DbSchema extends Schema>(
  schema: DbSchema,
  kvStore?: KvStore
): DB<DbSchema> => {
  const store: KvStore = kvStore || LOCALSTORAGE_AS_KVSTORE;
  const db = {};

  const getTableFromTableKey = (key: TableKey) => {
    const tableName = Object.keys(schema).find(
      (tblName) => schema[tblName]["key"] === key
    );
    if (!tableName)
      throw `Invalid key '${key}' passed to find table name from schema - '${JSON.stringify(
        schema
      )}'`;
    const table = db[tableName];
    if (!table) throw `Table with key '${key}' not found in the DB`;
    return table as Table<any, any>;
  };

  Object.entries(schema).forEach(([tableName, tableDetails]) => {
    const tableKey = tableDetails.key;
    const fkMappings = tableDetails.foreignKeyMappings;
    const db2jsMappings = tableDetails.dbToJsTypeMappings;
    const table = createTable(
      store,
      tableKey,
      getTableFromTableKey,
      fkMappings,
      db2jsMappings
    );
    db[tableName] = table;
  });

  return db as DB<DbSchema>;
};
