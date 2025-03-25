export type ObjectStoreTransaction<
  K extends keyof Conf,
  Conf extends DbConfig
> = {
  add: (value: Doc<K, Conf>, key?: IDBValidKey) => Promise<IDBValidKey>;
  clear: () => Promise<undefined>;
  count: (query?: IDBValidKey | IDBKeyRange) => Promise<number>;
  delete: (query: IDBValidKey | IDBKeyRange) => Promise<undefined>;
  get: (query: IDBValidKey | IDBKeyRange) => Promise<Doc<K, Conf> | undefined>;
  getAll: (
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ) => Promise<Doc<K, Conf>[]>;
  getAllKeys: (
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ) => Promise<IDBValidKey[]>;
  getKey: (
    query: IDBValidKey | IDBKeyRange
  ) => Promise<IDBValidKey | undefined>;
  put: (value: Doc<K, Conf>, key?: IDBValidKey) => Promise<IDBValidKey>;
  indices: {
    [I in IdxName<Conf>]: {
      count: (query?: IDBValidKey | IDBKeyRange) => Promise<number>;
      get: (query: IDBValidKey | IDBKeyRange) => Promise<Doc<K, Conf>>;
      getAll: (
        query?: IDBValidKey | IDBKeyRange | null,
        count?: number
      ) => Promise<Doc<K, Conf>[]>;
      getAllKeys: (
        query?: IDBValidKey | IDBKeyRange | null,
        count?: number
      ) => Promise<IDBValidKey[]>;
      getKey: (
        query: IDBValidKey | IDBKeyRange
      ) => Promise<IDBValidKey | undefined>;
    };
  };
};

export type DBSchema<Conf extends DbConfig> = {
  [K in keyof Conf]: ObjectStoreTransaction<K, Conf>;
};

export type DbConfig = {
  readonly [X in string]: {
    keyPathsShorthand: string;
    indices: readonly {
      [I in string]: string;
    }[];
    initialData: readonly object[];
  };
};

export type IdxName<Conf extends DbConfig> =
  keyof Conf[keyof Conf]["indices"][number];

export type Doc<
  K extends keyof Conf,
  Conf extends DbConfig
> = Conf[K]["initialData"][number];
