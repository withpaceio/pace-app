import type { ActivityLocation } from '@models/Activity';

export default function getElevationInMeters(locations: ActivityLocation[]): number {
  let elevation = 0;

  for (let i = 0; i < locations.length - 1; i += 1) {
    const currentAltitude = locations[i].altitude;
    const nextAltitude = locations[i + 1].altitude;
    elevation += nextAltitude - currentAltitude;
  }

  return elevation;
}
