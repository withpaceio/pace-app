import * as utf8 from '@stablelib/utf8';
import { decodeBase64, secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptCreationDate(
  encryptedCreationDate: string,
  activityEncryptionKey: Uint8Array,
): string {
  const decryptedCreationDateBuffer = secretboxOpen(
    decodeBase64(encryptedCreationDate),
    activityEncryptionKey,
  );

  return utf8.decode(decryptedCreationDateBuffer);
}
