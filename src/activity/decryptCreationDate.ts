import { decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptCreationDate(
  encryptedCreationDate: string,
  activityEncryptionKey: Uint8Array,
): string {
  const decryptedCreationDateBuffer = secretboxOpen(
    decodeBase64(encryptedCreationDate),
    activityEncryptionKey,
  );

  return encodeUtf8(decryptedCreationDateBuffer);
}
