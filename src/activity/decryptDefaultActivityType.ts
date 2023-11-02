import { type KeyPair, boxOpen } from 'react-native-nacl-jsi';

import { ActivityType } from '@models/Activity';

export default function decryptDefaultActivityType(
  encryptedDefaultActivityType: string,
  encryptionKeyPair: KeyPair,
): ActivityType {
  let decryptedDefaultActivityType;

  try {
    decryptedDefaultActivityType = boxOpen(
      encryptedDefaultActivityType,
      encryptionKeyPair.publicKey,
      encryptionKeyPair.secretKey,
    );
  } catch {
    return ActivityType.RUNNING;
  }

  if (!decryptedDefaultActivityType) {
    return ActivityType.RUNNING;
  }

  const defaultActivityType = decryptedDefaultActivityType.replace(/\0/g, '');
  return defaultActivityType as ActivityType;
}
