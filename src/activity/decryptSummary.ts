import * as utf8 from '@stablelib/utf8';
import { decodeBase64, secretboxOpen } from 'react-native-nacl-jsi';

import type { ActivitySummary } from '@models/Activity';

export default function decryptSummary(
  encryptedSummary: string,
  activityEncryptionKey: Uint8Array,
): ActivitySummary {
  const decryptedSummaryBuffer = secretboxOpen(
    decodeBase64(encryptedSummary),
    activityEncryptionKey,
  );
  const decryptedSummary = utf8.decode(decryptedSummaryBuffer);

  return JSON.parse(decodeURI(decryptedSummary));
}
