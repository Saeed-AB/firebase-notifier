const storeName = "firebaseStore";
const storeObjectName = "firebaseDate";
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(storeName, 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(storeObjectName, {
        keyPath: "token",
        autoIncrement: true,
      });
    };
  });
};

// Get data from the object store
export const getDBToken = async (): Promise<string | undefined> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeObjectName], "readonly");
    const store = transaction.objectStore(storeObjectName);
    const request = store.openCursor();

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result?.value?.token as string);
  });
};

// Add data to the object store
export const addToken = async (token: string): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeObjectName], "readwrite");
    const store = transaction.objectStore(storeObjectName);
    const request = store.add({ token });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as number);
  });
};

// Delete data from the object store
export const deleteToken = async (token: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeObjectName], "readwrite");
    const store = transaction.objectStore(storeObjectName);
    const request = store.delete(token);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
