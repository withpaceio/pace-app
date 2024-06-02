import { decodeUtf8, encodeBase64, secretboxSeal } from 'react-native-nacl-jsi';

export default function encryptCreationDate(
  creationDate: string,
  activityEncryptionKey: Uint8Array,
): string {
  const encryptedCreationDateBuffer = secretboxSeal(
    decodeUtf8(creationDate),
    activityEncryptionKey,
  );

  return encodeBase64(encryptedCreationDateBuffer);
}
