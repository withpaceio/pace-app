import type { ActivityLocation } from '@models/Activity';

import { computeDistanceBetweenPointsInMeters } from './getDistanceInKilometers';

const DISTANCE_THRESOLD_IN_METERS = 30;
const ELEVATION_THRESOLD_IN_METERS = 20;

export default function getElevationGainInMeters(locations: ActivityLocation[]): number {
  let elevationGain = 0;

  let i = 0;
  while (i < locations.length - 1) {
    let j = i + 1;
    while (
      computeDistanceBetweenPointsInMeters(locations[i], locations[j]) <=
        DISTANCE_THRESOLD_IN_METERS &&
      Math.abs(locations[j].altitude - locations[i].altitude) <= ELEVATION_THRESOLD_IN_METERS &&
      j < locations.length - 1
    ) {
      j += 1;
    }

    const diffElevation = locations[j].altitude - locations[i].altitude;
    if (diffElevation > 0) {
      elevationGain += diffElevation;
    }

    i = j;
  }

  return elevationGain;
}
