import { KVStore } from "./kv-store";
import { TableRecordID } from "./utils";

export type KvsIDManager = {
  getCurrentID: () => TableRecordID;
  useNewID: (callback: (newId: TableRecordID) => void) => TableRecordID;
};

export const getKVStoreIDManager = (kvStore: KVStore): KvsIDManager => {
  return {
    getCurrentID: function (): TableRecordID {
      let maxID = kvStore.getItem("maxID");
      if (!maxID) kvStore.setItem("maxID", "0");
      maxID = kvStore.getItem("maxID");
      if (maxID === undefined)
        throw `Error setting the value for key 'maxID' in KV Store.`;
      return +maxID;
    },
    useNewID: function (
      callback: (newId: TableRecordID) => void
    ): TableRecordID {
      const thisIDGen = this as KvsIDManager;
      const newID = thisIDGen.getCurrentID() + 1;
      callback(newID);
      kvStore.setItem("maxID", `${newID}`);
      return newID;
    },
  };
};
