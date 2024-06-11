import * as utf8 from '@stablelib/utf8';
import { decodeBase64, secretboxOpen } from 'react-native-nacl-jsi';

import { ActivityLocation } from '@models/Activity';

export default function decryptLocations(
  encryptedLocations: string,
  activityEncryptionKey: string,
): ActivityLocation[] {
  const decryptedLocationsBuffer = secretboxOpen(
    decodeBase64(encryptedLocations),
    decodeBase64(activityEncryptionKey),
  );
  const decryptedLocations = utf8.decode(decryptedLocationsBuffer);

  return JSON.parse(decodeURI(decryptedLocations)) as ActivityLocation[];
}
