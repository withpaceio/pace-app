import { secretboxOpen } from 'react-native-nacl-jsi';

import type { ActivitySummary } from '@models/Activity';

export default function decryptSummary(
  encryptedSummary: string,
  activityEncryptionKey: string,
): ActivitySummary | null {
  try {
    const decryptedSummary = secretboxOpen(encryptedSummary, activityEncryptionKey);
    return JSON.parse(decodeURI(decryptedSummary.replace(/\0/g, '')));
  } catch {
    return null;
  }
}
