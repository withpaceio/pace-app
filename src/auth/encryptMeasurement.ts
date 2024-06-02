import { KeyPair, boxSeal, decodeUtf8, encodeBase64 } from 'react-native-nacl-jsi';

export default function encryptMeasurement(
  measurement: 'imperial' | 'metric',
  encryptionKeyPair: KeyPair,
): string {
  const encryptedMeasurement = boxSeal(
    decodeUtf8(measurement),
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return encodeBase64(encryptedMeasurement);
}
