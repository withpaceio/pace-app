import { KeyPair, SECRETBOX_KEY_LENGTH, boxSeal, getRandomBytes } from 'react-native-nacl-jsi';

import type { ActivitySummary } from '@models/Activity';

import encryptCreationDate from './encryptCreationDate';
import encryptSummary from './encryptSummary';

export default function encryptActivity(
  summary: ActivitySummary,
  encryptionKeyPair: KeyPair,
): {
  activityEncryptionKey: string;
  encryptedActivityEncryptionKey: string;
  encryptedSummary: string;
  encryptedCreatedAt: string;
} {
  const activityEncryptionKey = getRandomBytes(SECRETBOX_KEY_LENGTH);

  const encryptedSummary = encryptSummary(summary, activityEncryptionKey);
  const encryptedCreatedAt = encryptCreationDate(summary.createdAt, activityEncryptionKey);

  const encryptedActivityEncryptionKey = boxSeal(
    activityEncryptionKey,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return {
    activityEncryptionKey,
    encryptedActivityEncryptionKey,
    encryptedSummary,
    encryptedCreatedAt,
  };
}
