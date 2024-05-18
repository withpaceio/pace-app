import type { ActivityLocationDistance } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import getSpeedInKilometersPerHour from '../getSpeedInKilometersPerHour';
import { getHistogram } from './helpers';

function computePacePoint(
  distanceDifference: number,
  timeDifference: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
): number {
  return Math.max(
    0,
    getSpeedInKilometersPerHour(
      distanceDifference / 1000,
      timeDifference / 1000,
      distanceMeasurementSystem,
    ),
  );
}

export default function getSpeedHistogram(
  locations: ActivityLocationDistance[],
  length: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
): ReturnType<typeof getHistogram> {
  return getHistogram(locations, length, distanceMeasurementSystem, computePacePoint);
}
