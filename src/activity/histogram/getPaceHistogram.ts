import type { ActivityLocationDistance } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { getHistogram } from './helpers';
import getPaceInMinutesPerKilometers from '../getPaceInMinutesPerKilometers';

function computePacePoint(
  distanceDifference: number,
  timeDifference: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  slowestPace: number,
): number {
  return Math.max(
    0,
    Math.min(
      slowestPace,
      getPaceInMinutesPerKilometers(
        distanceDifference / 1000,
        timeDifference / 1000,
        distanceMeasurementSystem,
      ),
    ),
  );
}

export default function getPaceHistogram(
  locations: ActivityLocationDistance[],
  length: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
): ReturnType<typeof getHistogram> {
  const slowestPace = distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 10 : 16.0934;
  return getHistogram(locations, length, distanceMeasurementSystem, (...args) =>
    computePacePoint(...args, slowestPace),
  );
}
