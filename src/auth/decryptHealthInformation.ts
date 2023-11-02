import * as base64 from '@stablelib/base64';
import { type KeyPair, boxOpen, secretboxOpen } from 'react-native-nacl-jsi';

import type { HealthInformation } from '@models/HealthInformation';

export default function decryptHealthInformation(
  encryptedHealthInformation: string,
  encryptedHealthInformationEncryptionKey: string,
  encryptionKeyPair: KeyPair,
): { healthInformation: HealthInformation; encryptionKey: Uint8Array } | null {
  try {
    const healthInformationEncryptionKeyString = boxOpen(
      encryptedHealthInformationEncryptionKey,
      encryptionKeyPair.publicKey,
      encryptionKeyPair.secretKey,
    ).replace(/\0/g, '');
    const healthInformation = secretboxOpen(
      encryptedHealthInformation,
      healthInformationEncryptionKeyString,
    ).replace(/\0/g, '');
    const encryptionKey = base64.decode(healthInformationEncryptionKeyString);

    return { healthInformation: JSON.parse(decodeURI(healthInformation)), encryptionKey };
  } catch {
    return null;
  }
}
