import { DistanceMeasurementSystem } from '@models/UnitSystem';

export default function getPaceInMinutesPerKilometers(
  distanceInKilometers: number,
  durationInSeconds: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
): number {
  if (distanceInKilometers === 0) {
    return 0;
  }

  const durationInMinutes = durationInSeconds / 60;
  const distance =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? distanceInKilometers
      : distanceInKilometers / 1.60934;

  const pace = durationInMinutes / distance;

  const paceMinutes = Math.trunc(pace);
  const remainder = pace - paceMinutes;
  const paceSeconds = remainder * 60;

  return paceMinutes + paceSeconds / 100;
}
