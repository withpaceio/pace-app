import { decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptMapSnapshot(
  encryptedMapSnapshot: string,
  activityEncryptionKey: string,
): string {
  const decryptedMapSnapshotBuffer = secretboxOpen(
    decodeBase64(encryptedMapSnapshot),
    decodeBase64(activityEncryptionKey),
  );

  return encodeUtf8(decryptedMapSnapshotBuffer);
}
