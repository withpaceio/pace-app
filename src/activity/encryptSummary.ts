import { secretboxSeal } from 'react-native-nacl-jsi';

import type { ActivitySummary } from '@models/Activity';

export default function encryptSummary(
  summary: ActivitySummary,
  activityEncryptionKey: string,
): string {
  const encryptedSummary = secretboxSeal(JSON.stringify(summary), activityEncryptionKey);
  return encryptedSummary;
}
