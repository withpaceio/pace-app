import * as SecureStore from 'expo-secure-store';

import { HEALTH_INFORMATION_LOCATION } from './consts';

export default async function loadHealthInformation(): Promise<{
  encryptedHealthInformation: string;
  encryptedHealthInformationEncryptionKey: string;
} | null> {
  try {
    const serializedHealthInformationAndKey = await SecureStore.getItemAsync(
      HEALTH_INFORMATION_LOCATION,
    );

    if (!serializedHealthInformationAndKey) {
      return null;
    }

    const encryptedHealthInformationAndKey = JSON.parse(serializedHealthInformationAndKey);
    return {
      encryptedHealthInformation: encryptedHealthInformationAndKey.encryptedHealthInformation,
      encryptedHealthInformationEncryptionKey:
        encryptedHealthInformationAndKey.healthInformationEncryptionKey,
    };
  } catch {
    return null;
  }
}
