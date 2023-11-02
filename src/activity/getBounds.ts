import type { ActivityLocation } from '@models/Activity';

export default function getActivityBounds(locations: ActivityLocation[]): [number, number][] {
  const { minLatitude, maxLatitude, minLongitude, maxLongitude } = locations.reduce(
    (
      { minLatitude: minLat, maxLatitude: maxLat, minLongitude: minLon, maxLongitude: maxLon },
      { latitude, longitude },
    ) => ({
      minLatitude: Math.min(minLat, latitude),
      maxLatitude: Math.max(maxLat, latitude),
      minLongitude: Math.min(minLon, longitude),
      maxLongitude: Math.max(maxLon, longitude),
    }),
    {
      minLatitude: Number.MAX_SAFE_INTEGER,
      maxLatitude: Number.MIN_SAFE_INTEGER,
      minLongitude: Number.MAX_SAFE_INTEGER,
      maxLongitude: Number.MIN_SAFE_INTEGER,
    },
  );

  return [
    [minLongitude, minLatitude],
    [maxLongitude, maxLatitude],
  ];
}
