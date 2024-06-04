import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const persister = createSyncStoragePersister({
  storage: {
    setItem: (key: string, value: string): void => {
      storage.set(key, value);
    },
    getItem: (key: string): string | null => {
      const value = storage.getString(key);
      return value === undefined ? null : value;
    },
    removeItem: (key: string): void => {
      storage.delete(key);
    },
  },
  throttleTime: 3000,
});
