import {
  type KeyPair,
  SECRETBOX_KEY_LENGTH,
  boxSeal,
  decodeUtf8,
  encodeBase64,
  getRandomBytes,
  secretboxSeal,
} from 'react-native-nacl-jsi';

import type { HealthInformation } from '@models/HealthInformation';

export default function encryptHealthInformation(
  healthInformation: HealthInformation,
  healthInformationEncryptionKey: Uint8Array | null,
  encryptionKeyPair: KeyPair,
): {
  healthInformationEncryptionKey: string;
  encryptedHealthInformationEncryptionKey: string;
  encryptedHealthInformation: string;
} {
  const encryptionKey = healthInformationEncryptionKey || getRandomBytes(SECRETBOX_KEY_LENGTH);

  const encryptedHealthInformation = secretboxSeal(
    decodeUtf8(encodeURI(JSON.stringify(healthInformation))),
    encryptionKey,
  );
  const encryptedHealthInformationEncryptionKey = boxSeal(
    encryptionKey,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return {
    healthInformationEncryptionKey: encodeBase64(encryptionKey),
    encryptedHealthInformationEncryptionKey: encodeBase64(encryptedHealthInformationEncryptionKey),
    encryptedHealthInformation: encodeBase64(encryptedHealthInformation),
  };
}
