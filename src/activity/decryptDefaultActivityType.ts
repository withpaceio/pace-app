import { type KeyPair, boxOpen, decodeBase64, encodeUtf8 } from 'react-native-nacl-jsi';

import { ActivityType } from '@models/Activity';

export default function decryptDefaultActivityType(
  encryptedDefaultActivityType: string,
  encryptionKeyPair: KeyPair,
): ActivityType {
  let decryptedDefaultActivityTypeBuffer;

  try {
    decryptedDefaultActivityTypeBuffer = boxOpen(
      decodeBase64(encryptedDefaultActivityType),
      encryptionKeyPair.publicKey,
      encryptionKeyPair.secretKey,
    );
  } catch {
    return ActivityType.RUNNING;
  }

  return encodeUtf8(decryptedDefaultActivityTypeBuffer) as ActivityType;
}
