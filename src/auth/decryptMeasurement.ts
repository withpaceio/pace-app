import { type KeyPair, boxOpen } from 'react-native-nacl-jsi';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

export default function decryptMeasurement(
  encryptedMeasurement: string,
  encryptionKeyPair: KeyPair,
): DistanceMeasurementSystem {
  let decryptedMeasurement: string;

  try {
    decryptedMeasurement = boxOpen(
      encryptedMeasurement,
      encryptionKeyPair.publicKey,
      encryptionKeyPair.secretKey,
    );
  } catch {
    return DistanceMeasurementSystem.METRIC;
  }

  if (!decryptedMeasurement) {
    return DistanceMeasurementSystem.METRIC;
  }

  const measurement = decryptedMeasurement.replace(/\0/g, '');
  return measurement as DistanceMeasurementSystem;
}
