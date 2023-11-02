import { secretboxOpen } from 'react-native-nacl-jsi';

import { ActivityLocation } from '@models/Activity';

export default function decryptLocations(
  encryptedLocations: string,
  activityEncryptionKey: string,
): ActivityLocation[] {
  const decryptedLocations = secretboxOpen(
    encryptedLocations,
    activityEncryptionKey.replace(/\0/g, ''),
  );
  return JSON.parse(decodeURI(decryptedLocations.replace(/\0/g, ''))) as ActivityLocation[];
}
