import { type KeyPair, boxOpen, decodeBase64, encodeUtf8 } from 'react-native-nacl-jsi';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

export default function decryptMeasurement(
  encryptedMeasurement: string,
  encryptionKeyPair: KeyPair,
): DistanceMeasurementSystem {
  let decryptedMeasurementBuffer: Uint8Array;

  try {
    decryptedMeasurementBuffer = boxOpen(
      decodeBase64(encryptedMeasurement),
      encryptionKeyPair.publicKey,
      encryptionKeyPair.secretKey,
    );
  } catch {
    return DistanceMeasurementSystem.METRIC;
  }

  if (!decryptedMeasurementBuffer) {
    return DistanceMeasurementSystem.METRIC;
  }

  return encodeUtf8(decryptedMeasurementBuffer) as DistanceMeasurementSystem;
}
