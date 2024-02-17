import { Stores } from "../sharedTypes";

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

const dbName = "firebase-store";

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open(dbName);

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.FirebaseData)) {
        db.createObjectStore(Stores.FirebaseData, { keyPath: "token" });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addData = <T>(
  storeName: string,
  data: T
): Promise<T | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};

export const deleteData = (
  storeName: string,
  key: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    // again open the connection
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      // add listeners that will resolve the Promise
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        resolve(false);
      };
    };
  });
};

export const getTokenFromDb = async () => {
  const data = await getStoreData<{ token: string }>(Stores.FirebaseData);
  return data?.[0]?.token ?? "";
};
