import * as utf8 from '@stablelib/utf8';
import { decodeBase64, secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptMapSnapshot(
  encryptedMapSnapshot: string,
  activityEncryptionKey: string,
): string {
  const decryptedMapSnapshotBuffer = secretboxOpen(
    decodeBase64(encryptedMapSnapshot),
    decodeBase64(activityEncryptionKey),
  );

  return utf8.decode(decryptedMapSnapshotBuffer);
}
