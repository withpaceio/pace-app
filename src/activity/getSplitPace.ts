import { type ActivityLocation, ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { computeDistanceBetweenPointsInMeters } from './getDistanceInKilometers';
import getDurationInSeconds from './getDurationInSeconds';
import getElevationInMeters from './getElevationInMeters';
import getPaceInMinutesPerKilometers from './getPaceInMinutesPerKilometers';
import getSpeedInKilometersPerHour from './getSpeedInKilometersPerHour';
import type { Split } from './types';

export default function getSplits(
  activityType: ActivityType,
  locations: ActivityLocation[],
  distanceMeasurementSystem: DistanceMeasurementSystem,
  splitLengthInMeters: number,
): Split[] {
  if (!locations || locations.length < 2) {
    return [];
  }

  const splits: Split[] = [];

  const distanceConversionFactor =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 1 : 1.60934;

  let i = 0;
  while (i < locations.length - 2) {
    const kilometerPoints: ActivityLocation[] = [];

    let currentDistance = 0;
    let j = i;
    while (
      j < locations.length - 2 &&
      currentDistance < splitLengthInMeters * distanceConversionFactor
    ) {
      const currentPoint = locations[j];
      const nextPoint = locations[j + 1];
      currentDistance += computeDistanceBetweenPointsInMeters(currentPoint, nextPoint);
      kilometerPoints.push(currentPoint);
      j += 1;
    }

    const splitDuration = getDurationInSeconds(
      kilometerPoints[0],
      kilometerPoints[kilometerPoints.length - 1],
    );
    const splitPace =
      activityType === ActivityType.RUNNING
        ? getPaceInMinutesPerKilometers(
            currentDistance / 1000,
            splitDuration,
            distanceMeasurementSystem,
          )
        : getSpeedInKilometersPerHour(
            currentDistance / 1000,
            splitDuration,
            distanceMeasurementSystem,
          );

    const splitElevation = getElevationInMeters(kilometerPoints);

    splits.push({
      distance:
        currentDistance < splitLengthInMeters * distanceConversionFactor
          ? parseFloat((currentDistance / 1000 / distanceConversionFactor).toFixed(1))
          : Math.trunc(currentDistance / 1000),
      pace: splitPace,
      elevation:
        distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
          ? splitElevation
          : splitElevation * 3.28084,
      startIndex: i,
      endIndex: j,
    });
    i = j;
  }

  return splits;
}
