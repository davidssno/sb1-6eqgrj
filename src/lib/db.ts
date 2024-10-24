import { openDB } from 'idb';
import type { SubredditData } from '../types/subreddit';

const DB_NAME = 'subredditsDB';
const STORE_NAME = 'subreddits';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'subreddit' });
    }
  },
});

export const insertSubreddits = async (data: SubredditData[]) => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  for (const item of data) {
    await store.put(item);
  }
  await tx.done;
};

export const getAllSubreddits = async (): Promise<SubredditData[]> => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const deleteSubreddit = async (subreddit: string) => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, subreddit);
};

export const deleteSubreddits = async (subreddits: string[]) => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  for (const subreddit of subreddits) {
    await store.delete(subreddit);
  }
  await tx.done;
};

export const purgeDatabase = async () => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  await tx.done;
};