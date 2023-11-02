import type { ActivityType } from '@models/Activity';
import type { HealthInformation } from '@models/HealthInformation';

import MET from './calories/met';
import convertPaceInMinutesPerMiles from './convertPaceInMinutesPerMiles';

function getActivityMet(
  activityType: ActivityType,
  paceInMinutesPerKilometers: number,
): number | null {
  const activityTypeMet = MET[activityType];
  if (!activityTypeMet) {
    return null;
  }

  const paceInMinutesPerMiles = convertPaceInMinutesPerMiles(paceInMinutesPerKilometers);
  const paceInMilesPerHour = Math.max(
    activityTypeMet[0].pace,
    Math.min(
      activityTypeMet[activityTypeMet.length - 1].pace,
      Math.round(60 / paceInMinutesPerMiles),
    ),
  );
  return activityTypeMet.find(({ pace }) => pace === paceInMilesPerHour)?.met || null;
}

export default function getCalories(
  activityType: ActivityType,
  paceInMinutesPerKilometers: number,
  durationInSeconds: number,
  healthInformation: HealthInformation,
): number | null {
  const activityMet = getActivityMet(activityType, paceInMinutesPerKilometers);
  if (!activityMet) {
    return null;
  }

  const durationInHours = durationInSeconds / 60 / 60;

  return activityMet * durationInHours * healthInformation.weight;
}
