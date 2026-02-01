const DB_NAME = "unsplash-wallpapers";
const STORE_NAME = "images";
const META_STORE = "meta";
const MAX_IMAGES = 5;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore(STORE_NAME);
      db.createObjectStore(META_STORE);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function setMeta(key, value) {
  const db = await openDB();
  const tx = db.transaction(META_STORE, "readwrite");
  tx.objectStore(META_STORE).put(value, key);
}

export async function getMeta(key) {
  const db = await openDB();
  const tx = db.transaction(META_STORE, "readonly");
  return tx.objectStore(META_STORE).get(key);
}

export async function saveImages(images) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  store.clear();
  images.forEach((url, i) => store.put(url, i));
}

export async function getStoredImages() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return Promise.all(
    [...Array(MAX_IMAGES).keys()].map(
      (i) =>
        new Promise((res) => {
          const r = store.get(i);
          r.onsuccess = () => res(r.result);
          r.onerror = () => res(null);
        })
    )
  ).then((r) => r.filter(Boolean));
}
