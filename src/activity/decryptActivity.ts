import { type KeyPair, boxOpen } from 'react-native-nacl-jsi';

import type { Activity } from '@models/Activity';

import decryptCreationDate from './decryptCreationDate';
import decryptSummary from './decryptSummary';

export default function decryptActivity(
  encryptedActivity: Activity,
  encryptionKeyPair: KeyPair,
): Activity {
  const activityEncryptionKey = boxOpen(
    encryptedActivity.encryptionKey,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  ).replace(/\0/g, '');

  const summary = decryptSummary(encryptedActivity.summary as string, activityEncryptionKey);
  const createdAt = decryptCreationDate(encryptedActivity.createdAt, activityEncryptionKey);

  return {
    ...encryptedActivity,
    encryptionKey: activityEncryptionKey,
    summary,
    createdAt,
  };
}
