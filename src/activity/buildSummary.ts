import type { ActivitySummary, ActivityType } from '@models/Activity';
import type { HealthInformation } from '@models/HealthInformation';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import getCalories from './getCalories';
import getPaceInMinutesPerKilometers from './getPaceInMinutesPerKilometers';

export default function buildSummary(
  name: string,
  type: ActivityType,
  startTimestamp: number,
  endTimestamp: number,
  distance: number,
  healthInformation: HealthInformation | null,
): ActivitySummary {
  const duration = (endTimestamp - startTimestamp) / 1000;
  const pace = getPaceInMinutesPerKilometers(distance, duration, DistanceMeasurementSystem.METRIC);
  const date = new Date(startTimestamp).toISOString();

  const summary = {
    name,
    type,
    distance,
    duration,
    pace,
    createdAt: date,
    updatedAt: date,
  };

  if (!healthInformation) {
    return summary;
  }

  const calories = getCalories(type, pace, duration, healthInformation);
  if (!calories) {
    return summary;
  }

  return { ...summary, calories };
}
