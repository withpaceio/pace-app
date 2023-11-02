import type { ActivityLocation } from '@models/Activity';

export default function getDurationInSeconds(
  location1: ActivityLocation,
  location2: ActivityLocation,
): number {
  return (location2.timestamp - location1.timestamp) / 1000;
}
