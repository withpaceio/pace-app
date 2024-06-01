import { decodeUtf8, encodeBase64, secretboxSeal } from 'react-native-nacl-jsi';

export default function encryptMapSnapshot(
  mapSnapshot: string,
  activityEncryptionKey: Uint8Array,
): string {
  const encryptedMapsnapshotBuffer = secretboxSeal(decodeUtf8(mapSnapshot), activityEncryptionKey);
  return encodeBase64(encryptedMapsnapshotBuffer);
}
