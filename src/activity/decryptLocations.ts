import { decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

import { ActivityLocation } from '@models/Activity';

export default function decryptLocations(
  encryptedLocations: string,
  activityEncryptionKey: string,
): ActivityLocation[] {
  const decryptedLocationsBuffer = secretboxOpen(
    decodeBase64(encryptedLocations),
    decodeBase64(activityEncryptionKey),
  );
  const decryptedLocations = encodeUtf8(decryptedLocationsBuffer);

  return JSON.parse(decodeURI(decryptedLocations)) as ActivityLocation[];
}
