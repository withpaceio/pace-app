import * as utf8 from '@stablelib/utf8';
import { type KeyPair, boxOpen, decodeBase64 } from 'react-native-nacl-jsi';

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

  return utf8.decode(decryptedDefaultActivityTypeBuffer) as ActivityType;
}
