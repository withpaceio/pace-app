import { type KeyPair, boxOpen, decodeBase64 } from 'react-native-nacl-jsi';

import type { Activity, EncryptedActivity } from '@models/Activity';

import decryptCreationDate from './decryptCreationDate';
import decryptSummary from './decryptSummary';

export default function decryptActivity(
  encryptedActivity: EncryptedActivity,
  encryptionKeyPair: KeyPair,
): Activity {
  const activityEncryptionKey = boxOpen(
    decodeBase64(encryptedActivity.encryptionKey),
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  const summary = decryptSummary(encryptedActivity.summary as string, activityEncryptionKey);
  const createdAt = decryptCreationDate(encryptedActivity.createdAt, activityEncryptionKey);

  return {
    ...encryptedActivity,
    encryptionKey: activityEncryptionKey,
    summary,
    createdAt,
  };
}
