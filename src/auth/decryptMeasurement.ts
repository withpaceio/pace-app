import * as utf8 from '@stablelib/utf8';
import { type KeyPair, boxOpen, decodeBase64 } from 'react-native-nacl-jsi';

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

  return utf8.decode(decryptedMeasurementBuffer) as DistanceMeasurementSystem;
}
