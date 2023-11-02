import { type KeyPair, boxSeal } from 'react-native-nacl-jsi';

import type { ActivityType } from '@models/Activity';

export default function encryptDefaultActivityType(
  activityType: ActivityType,
  encryptionKeyPair: KeyPair,
): string {
  const encryptedActivityType = boxSeal(
    activityType,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return encryptedActivityType;
}
