import { type KeyPair, boxSeal, decodeUtf8, encodeBase64 } from 'react-native-nacl-jsi';

import type { ActivityType } from '@models/Activity';

export default function encryptDefaultActivityType(
  activityType: ActivityType,
  encryptionKeyPair: KeyPair,
): string {
  const encryptedActivityTypeBuffer = boxSeal(
    decodeUtf8(activityType),
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return encodeBase64(encryptedActivityTypeBuffer);
}
