import { DistanceMeasurementSystem } from '@models/UnitSystem';

export default function getSpeedInKilometersPerHour(
  distanceInKilometers: number,
  durationInSeconds: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
): number {
  if (durationInSeconds === 0) {
    return 0;
  }

  const durationInHours = durationInSeconds / 60 / 60;
  const distance =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? distanceInKilometers
      : distanceInKilometers / 1.60934;

  return distance / durationInHours;
}
