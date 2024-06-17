import { type ActivitySummary, ActivityType } from '@models/Activity';
import type { HealthInformation } from '@models/HealthInformation';

import convertPaceInMinutesPerKmToKmPerHour from './convertPaceInMinutesPerKmToKmPerHour';
import convertPaceKmPerHourToMinutesPerKm from './convertPaceKmPerHourToMinutesPerKm';
import getCalories from './getCalories';

function convertPace(pace: number, fromType: ActivityType, toType: ActivityType): number {
  if (fromType === ActivityType.RUNNING && toType === ActivityType.CYCLING) {
    return convertPaceInMinutesPerKmToKmPerHour(pace);
  }

  if (fromType === ActivityType.CYCLING && toType === ActivityType.RUNNING) {
    return convertPaceKmPerHourToMinutesPerKm(pace);
  }

  return pace;
}

export default function updateSummary(
  name: string,
  type: ActivityType,
  summary: ActivitySummary,
  healthInformation: HealthInformation | undefined,
): ActivitySummary {
  const pace = convertPace(summary.pace, summary.type, type);
  const calories = healthInformation
    ? getCalories(type, summary.pace, summary.duration, healthInformation)
    : undefined;

  const updatedSummary: ActivitySummary = {
    ...summary,
    name,
    type,
    pace,
    calories: calories || undefined,
  };

  return updatedSummary;
}
