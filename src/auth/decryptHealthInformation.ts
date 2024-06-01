import {
  type KeyPair,
  boxOpen,
  decodeBase64,
  decodeUtf8,
  encodeUtf8,
  secretboxOpen,
} from 'react-native-nacl-jsi';

import type { HealthInformation } from '@models/HealthInformation';

export default function decryptHealthInformation(
  encryptedHealthInformation: string,
  encryptedHealthInformationEncryptionKey: string,
  encryptionKeyPair: KeyPair,
): { healthInformation: HealthInformation; encryptionKey: Uint8Array } | null {
  try {
    const encryptionKey = boxOpen(
      decodeBase64(encryptedHealthInformationEncryptionKey),
      encryptionKeyPair.publicKey,
      encryptionKeyPair.secretKey,
    );

    const healthInformationBuffer = secretboxOpen(
      decodeUtf8(encryptedHealthInformation),
      encryptionKey,
    );
    const healthInformation = JSON.parse(
      decodeURI(encodeUtf8(healthInformationBuffer)),
    ) as HealthInformation;

    return { healthInformation, encryptionKey };
  } catch {
    return null;
  }
}
