import type { ActivityLocation, ActivityLocationDistance } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { computeDistanceBetweenPointsInMeters } from './getDistanceInKilometers';
import getPaceInMinutesPerKilometers from './getPaceInMinutesPerKilometers';

export default function getCumulativeDistanceInMeters(
  locations: ActivityLocation[],
  distanceMeasurementSystem: DistanceMeasurementSystem,
): ActivityLocationDistance[] {
  return locations.reduce<ActivityLocationDistance[]>((allDistances, currentLocation, index) => {
    if (index === 0) {
      allDistances.push({ ...currentLocation, cumulativeDistance: 0, pace: 0 });
      return allDistances;
    }

    const distanceConversionFactor =
      distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 1 : 1.60934;
    const previousLocation = allDistances[index - 1];
    const distance =
      previousLocation.segment === currentLocation.segment
        ? computeDistanceBetweenPointsInMeters(previousLocation, currentLocation) /
          distanceConversionFactor
        : 0;

    allDistances.push({
      ...currentLocation,
      cumulativeDistance: previousLocation.cumulativeDistance + distance,
      pace: Math.min(
        18,
        getPaceInMinutesPerKilometers(
          distance / 1000,
          (currentLocation.timestamp - previousLocation.timestamp) / 1000,
          distanceMeasurementSystem,
        ),
      ),
    });

    return allDistances;
  }, []);
}
