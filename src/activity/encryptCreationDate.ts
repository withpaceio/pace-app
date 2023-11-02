import { secretboxSeal } from 'react-native-nacl-jsi';

export default function encryptCreationDate(
  creationDate: string,
  activityEncryptionKey: string,
): string {
  const encryptedCreationDate = secretboxSeal(creationDate, activityEncryptionKey);
  return encryptedCreationDate;
}
