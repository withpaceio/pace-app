import { type KeyPair, boxOpen } from 'react-native-nacl-jsi';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

export default function decryptMeasurement(
  encryptedMeasurement: string,
  encryptionKeyPair: KeyPair,
): DistanceMeasurementSystem {
  const decryptedMeasurement = boxOpen(
    encryptedMeasurement,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  if (!decryptedMeasurement) {
    return DistanceMeasurementSystem.METRIC;
  }

  const measurement = decryptedMeasurement.replace(/\0/g, '');
  return measurement as DistanceMeasurementSystem;
}
