import * as SecureStore from 'expo-secure-store';

import { HEALTH_INFORMATION_LOCATION } from './consts';

export default async function saveHealthInformation(
  encryptedHealthInformation: string,
  encryptedHealthInformationEncryptionKey: string,
): Promise<boolean> {
  try {
    const serializedHealthInformationAndKey = JSON.stringify({
      encryptedHealthInformation,
      healthInformationEncryptionKey: encryptedHealthInformationEncryptionKey,
    });
    await SecureStore.setItemAsync(HEALTH_INFORMATION_LOCATION, serializedHealthInformationAndKey);
    return true;
  } catch {
    return false;
  }
}
