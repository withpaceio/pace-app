import {
  type KeyPair,
  boxOpen,
  decodeBase64,
  encodeBase64,
  encodeUtf8,
} from 'react-native-nacl-jsi';

import type { Activity, ActivitySummary, EncryptedActivity } from '@models/Activity';

import decryptCreationDate from './decryptCreationDate';
import decryptSummary from './decryptSummary';

function decryptLegacy(
  encryptedActivity: EncryptedActivity,
  encryptionKey: Uint8Array,
): { summary: ActivitySummary; createdAt: string; activityEncryptionKey: Uint8Array } {
  const legacyEncryptionKey = decodeBase64(encodeUtf8(encryptionKey));

  return {
    summary: decryptSummary(encryptedActivity.summary as string, legacyEncryptionKey),
    createdAt: decryptCreationDate(encryptedActivity.createdAt, legacyEncryptionKey),
    activityEncryptionKey: legacyEncryptionKey,
  };
}

export default function decryptActivity(
  encryptedActivity: EncryptedActivity,
  encryptionKeyPair: KeyPair,
): Activity {
  let activityEncryptionKey = boxOpen(
    decodeBase64(encryptedActivity.encryptionKey),
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  let summary: ActivitySummary;
  let createdAt: string;
  try {
    summary = decryptSummary(encryptedActivity.summary as string, activityEncryptionKey);
    createdAt = decryptCreationDate(encryptedActivity.createdAt, activityEncryptionKey);
  } catch {
    ({ summary, createdAt, activityEncryptionKey } = decryptLegacy(
      encryptedActivity,
      activityEncryptionKey,
    ));
  }

  return {
    ...encryptedActivity,
    encryptionKey: encodeBase64(activityEncryptionKey),
    summary,
    createdAt,
  };
}
