import type { ActivityLocation } from '@models/Activity';

// Uses the Haversine formula
export function computeDistanceBetweenPointsInMeters(
  location1: ActivityLocation,
  location2: ActivityLocation,
): number {
  const EARTH_RADIUS = 6371000;
  const radiant = Math.PI / 180;

  const lat1 = location1.latitude * radiant;
  const lat2 = location2.latitude * radiant;

  const sinDLat = Math.sin(((location2.latitude - location1.latitude) * radiant) / 2);
  const sinDLon = Math.sin(((location2.longitude - location1.longitude) * radiant) / 2);

  const a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
}

export default function getDistanceInKilometers(locations: ActivityLocation[]): number {
  let distance = 0;

  for (let i = 0; i < locations.length - 1; i += 1) {
    distance += computeDistanceBetweenPointsInMeters(locations[i], locations[i + 1]);
  }

  return distance / 1000;
}
