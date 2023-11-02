import {
  type KeyPair,
  SECRETBOX_KEY_LENGTH,
  boxSeal,
  getRandomBytes,
  secretboxSeal,
} from 'react-native-nacl-jsi';

import type { HealthInformation } from '@models/HealthInformation';

export default function encryptHealthInformation(
  healthInformation: HealthInformation,
  healthInformationEncryptionKeyString: string | null,
  encryptionKeyPair: KeyPair,
): {
  healthInformationEncryptionKey: string;
  encryptedHealthInformationEncryptionKey: string;
  encryptedHealthInformation: string;
} {
  const healthInformationEncryptionKey =
    healthInformationEncryptionKeyString || getRandomBytes(SECRETBOX_KEY_LENGTH);

  const encryptedHealthInformation = secretboxSeal(
    encodeURI(JSON.stringify(healthInformation)),
    healthInformationEncryptionKey,
  );
  const encryptedHealthInformationEncryptionKey = boxSeal(
    healthInformationEncryptionKey,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return {
    healthInformationEncryptionKey,
    encryptedHealthInformationEncryptionKey,
    encryptedHealthInformation,
  };
}
