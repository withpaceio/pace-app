import { decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

import { ActivityLocation } from '@models/Activity';

export default function decryptLocations(
  encryptedLocations: string,
  activityEncryptionKey: Uint8Array,
): ActivityLocation[] {
  const decryptedLocationsBuffer = secretboxOpen(
    decodeBase64(encryptedLocations),
    activityEncryptionKey,
  );
  const decryptedLocations = encodeUtf8(decryptedLocationsBuffer);

  return JSON.parse(decodeURI(decryptedLocations)) as ActivityLocation[];
}
