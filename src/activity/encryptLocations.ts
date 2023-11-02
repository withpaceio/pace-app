import { secretboxSeal } from 'react-native-nacl-jsi';

import type { ActivityLocation } from '@models/Activity';

export default function encryptLocations(
  locations: ActivityLocation[],
  activityEncryptionKey: string,
): string {
  const encryptedLocations = secretboxSeal(JSON.stringify(locations), activityEncryptionKey);
  return encryptedLocations;
}
