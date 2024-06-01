import { decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

import type { ActivitySummary } from '@models/Activity';

export default function decryptSummary(
  encryptedSummary: string,
  activityEncryptionKey: Uint8Array,
): ActivitySummary {
  const decryptedSummaryBuffer = secretboxOpen(
    decodeBase64(encryptedSummary),
    activityEncryptionKey,
  );
  const decryptedSummary = encodeUtf8(decryptedSummaryBuffer);

  return JSON.parse(decodeURI(decryptedSummary));
}
