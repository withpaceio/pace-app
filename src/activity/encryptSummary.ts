import { decodeUtf8, encodeBase64, secretboxSeal } from 'react-native-nacl-jsi';

import type { ActivitySummary } from '@models/Activity';

export default function encryptSummary(
  summary: ActivitySummary,
  activityEncryptionKey: Uint8Array,
): string {
  const summaryBuffer = decodeUtf8(JSON.stringify(summary));
  const encryptedSummaryBuffer = secretboxSeal(summaryBuffer, activityEncryptionKey);

  return encodeBase64(encryptedSummaryBuffer);
}
