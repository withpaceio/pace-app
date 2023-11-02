import {
  convertPaceInMinutesPerKmToKmPerHour,
  convertPaceKmPerHourToMinutesPerKm,
  getCalories,
} from '@activity';

import { type ActivitySummary, ActivityType } from '@models/Activity';
import type { HealthInformation } from '@models/HealthInformation';

function convertPace(pace: number, fromType: ActivityType, toType: ActivityType): number {
  if (fromType === ActivityType.RUNNING && toType === ActivityType.CYCLING) {
    return convertPaceInMinutesPerKmToKmPerHour(pace);
  }

  if (fromType === ActivityType.CYCLING && toType === ActivityType.RUNNING) {
    return convertPaceKmPerHourToMinutesPerKm(pace);
  }

  return pace;
}

export function updateSummary(
  name: string,
  type: ActivityType,
  summary: ActivitySummary,
  healthInformation: HealthInformation,
): ActivitySummary {
  const pace = convertPace(summary.pace, summary.type, type);
  const calories = getCalories(type, summary.pace, summary.duration, healthInformation);
  const updatedSummary: ActivitySummary = {
    ...summary,
    name,
    type,
    pace,
    calories: calories || undefined,
  };

  return updatedSummary;
}
