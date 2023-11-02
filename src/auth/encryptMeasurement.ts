import { KeyPair, boxSeal } from 'react-native-nacl-jsi';

export default function encryptMeasurement(
  measurement: 'imperial' | 'metric',
  encryptionKeyPair: KeyPair,
): string {
  const encryptedMeasurement = boxSeal(
    measurement,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return encryptedMeasurement;
}
