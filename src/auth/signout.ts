import * as FileSystem from 'expo-file-system';
import Purchases from 'react-native-purchases';

import { deleteProfile } from './storage';

export default async function signOut(): Promise<void> {
  await deleteProfile();
  if (FileSystem.cacheDirectory) {
    try {
      await FileSystem.deleteAsync(FileSystem.cacheDirectory);
    } catch {}
  }

  if (FileSystem.documentDirectory) {
    try {
      await FileSystem.deleteAsync(FileSystem.documentDirectory);
    } catch {}
  }

  try {
    await Purchases.logOut();
  } catch {}
}
