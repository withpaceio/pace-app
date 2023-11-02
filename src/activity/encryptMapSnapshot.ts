import { secretboxSeal } from 'react-native-nacl-jsi';

export default function encryptMapSnapshot(
  mapSnapshot: string,
  activityEncryptionKey: string,
): string {
  const encryptedMapsnapshot = secretboxSeal(mapSnapshot, activityEncryptionKey);
  return encryptedMapsnapshot;
}
