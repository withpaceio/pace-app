import { decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptMapSnapshot(
  encryptedMapSnapshot: string,
  activityEncryptionKey: Uint8Array,
): string {
  const decryptedMapSnapshotBuffer = secretboxOpen(
    decodeBase64(encryptedMapSnapshot),
    activityEncryptionKey,
  );

  return encodeUtf8(decryptedMapSnapshotBuffer);
}
