import { secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptCreationDate(
  encryptedCreationDate: string,
  activityEncryptionKey: string,
): string {
  return secretboxOpen(encryptedCreationDate, activityEncryptionKey.replace(/\0/g, '')).replace(
    /\0/g,
    '',
  );
}
