import * as utf8 from '@stablelib/utf8';
import {
  type KeyPair,
  boxOpen,
  decodeBase64,
  encodeBase64,
  secretboxOpen,
} from 'react-native-nacl-jsi';

import type { HealthInformation } from '@models/HealthInformation';

function decryptLegacy(
  encryptedHealthInformationBuffer: Uint8Array,
  encryptionKey: Uint8Array,
): { healthInformationBuffer: Uint8Array; encryptionKey: Uint8Array } {
  const legacyEncryptionKey = decodeBase64(utf8.decode(encryptionKey));

  return {
    healthInformationBuffer: secretboxOpen(encryptedHealthInformationBuffer, legacyEncryptionKey),
    encryptionKey: legacyEncryptionKey,
  };
}

export default function decryptHealthInformation(
  encryptedHealthInformation: string,
  encryptedHealthInformationEncryptionKey: string,
  encryptionKeyPair: KeyPair,
): { healthInformation: HealthInformation; encryptionKey: string } | null {
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
      decodeURI(utf8.decode(healthInformationBuffer)),
    ) as HealthInformation;

    return { healthInformation, encryptionKey: encodeBase64(encryptionKey) };
  } catch {
    return null;
  }
}
