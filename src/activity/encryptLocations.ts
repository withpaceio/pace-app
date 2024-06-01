import { decodeUtf8, encodeBase64, secretboxSeal } from 'react-native-nacl-jsi';

import type { ActivityLocation } from '@models/Activity';

export default function encryptLocations(
  locations: ActivityLocation[],
  activityEncryptionKey: Uint8Array,
): string {
  const locationsBuffer = decodeUtf8(JSON.stringify(locations));
  const encryptedLocationsBuffer = secretboxSeal(locationsBuffer, activityEncryptionKey);

  return encodeBase64(encryptedLocationsBuffer);
}
