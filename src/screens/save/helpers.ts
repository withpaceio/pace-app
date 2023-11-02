import type { KeyPair } from 'react-native-nacl-jsi';

import { encryptActivity, getCalories, getPaceInMinutesPerKilometers } from '@activity';

import { ActivitySummary, ActivityType } from '@models/Activity';
import type { HealthInformation } from '@models/HealthInformation';
import { DistanceMeasurementSystem } from '@models/UnitSystem';
import ActivityTask from '@tasks/ActivityTask';

export function getSummary(
  name: string,
  type: ActivityType,
  healthInformation: HealthInformation | null,
): ActivitySummary {
  const activityTask = ActivityTask.getInstance();

  const duration = (activityTask.endTimestamp - activityTask.startTimestamp) / 1000;
  const pace = getPaceInMinutesPerKilometers(
    activityTask.distance,
    duration,
    DistanceMeasurementSystem.METRIC,
  );
  const date = new Date(activityTask.startTimestamp).toISOString();

  const summary = {
    name,
    type,
    distance: activityTask.distance,
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

export function buildAndEncryptActivity(
  name: string,
  type: ActivityType,
  encryptionKeyPair: KeyPair,
  healthInformation: HealthInformation | null,
): ReturnType<typeof encryptActivity> {
  const summary = getSummary(name, type, healthInformation);
  return encryptActivity(summary, encryptionKeyPair);
}
