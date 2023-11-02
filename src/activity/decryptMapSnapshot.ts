import { secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptMapSnapshot(
  encryptedMapSnapshot: string,
  activityEncryptionKey: string,
): string {
  return secretboxOpen(encryptedMapSnapshot, activityEncryptionKey.replace(/\0/g, '')).replace(
    /\0/g,
    '',
  );
}
