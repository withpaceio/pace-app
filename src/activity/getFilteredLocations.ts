import type { ActivityLocation } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { computeDistanceBetweenPointsInMeters } from './getDistanceInKilometers';
import getPaceInMinutesPerKilometers from './getPaceInMinutesPerKilometers';

export default function getFilteredLocations(locations: ActivityLocation[]): ActivityLocation[] {
  return locations.reduce<ActivityLocation[]>((allLocations, currentLocation, index) => {
    if (index === 0) {
      allLocations.push(currentLocation);
      return allLocations;
    }

    const previousLocation = allLocations[allLocations.length - 1];
    const distance = computeDistanceBetweenPointsInMeters(previousLocation, currentLocation);
    const pace = getPaceInMinutesPerKilometers(
      distance / 1000,
      currentLocation.timestamp - previousLocation.timestamp,
      DistanceMeasurementSystem.METRIC,
    );
    if (pace >= 0) {
      allLocations.push(currentLocation);
    }

    return allLocations;
  }, []);
}
