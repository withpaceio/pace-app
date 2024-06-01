import {
  type KeyPair,
  boxOpen,
  decodeBase64,
  encodeUtf8,
  secretboxOpen,
} from 'react-native-nacl-jsi';

import type { HealthInformation } from '@models/HealthInformation';

function decryptLegacy(
  encryptedHealthInformationBuffer: Uint8Array,
  encryptionKey: Uint8Array,
): { healthInformationBuffer: Uint8Array; encryptionKey: Uint8Array } {
  const legacyEncryptionKey = decodeBase64(encodeUtf8(encryptionKey));

  return {
    healthInformationBuffer: secretboxOpen(encryptedHealthInformationBuffer, legacyEncryptionKey),
    encryptionKey: legacyEncryptionKey,
  };
}

export default function decryptHealthInformation(
  encryptedHealthInformation: string,
  encryptedHealthInformationEncryptionKey: string,
  encryptionKeyPair: KeyPair,
): { healthInformation: HealthInformation; encryptionKey: Uint8Array } | null {
  try {
    let encryptionKey = boxOpen(
      decodeBase64(encryptedHealthInformationEncryptionKey),
      encryptionKeyPair.publicKey,
      encryptionKeyPair.secretKey,
    );
    const encryptedHealthInformationBuffer = decodeBase64(encryptedHealthInformation);

    let healthInformationBuffer: Uint8Array;
    try {
      healthInformationBuffer = secretboxOpen(encryptedHealthInformationBuffer, encryptionKey);
    } catch {
      ({ healthInformationBuffer, encryptionKey } = decryptLegacy(
        encryptedHealthInformationBuffer,
        encryptionKey,
      ));
    }

    const healthInformation = JSON.parse(
      decodeURI(encodeUtf8(healthInformationBuffer)),
    ) as HealthInformation;

    return { healthInformation, encryptionKey };
  } catch {
    return null;
  }
}
