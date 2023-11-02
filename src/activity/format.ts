import convertPaceInMilesPerHour from './convertPaceInMilesPerHour';
import { DistanceMeasurementSystem } from '../models/UnitSystem';

export function formatDistance(
  distanceInKilometers: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideDecimals?: boolean,
): string {
  const distance =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? distanceInKilometers
      : distanceInKilometers * 0.621371;

  const roundedDistance = hideDecimals ? Math.round(distance) : Math.round(distance * 100) / 100;

  return distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
    ? `${roundedDistance}km`
    : `${roundedDistance}mi`;
}

export function formatDuration(durationInSeconds: number, hideSeconds?: boolean): string {
  'worklet';
  const hours = Math.trunc(durationInSeconds / 3600);
  const minutes = Math.trunc((durationInSeconds - hours * 3600) / 60);
  const seconds = Math.trunc(durationInSeconds - hours * 3600 - minutes * 60);

  const hoursMinutes = `${hours}h ${minutes}min`;
  if (hideSeconds) {
    return hoursMinutes;
  }

  return `${hoursMinutes} ${seconds}sec`;
}

export function formatStopwatchDuration(durationInSeconds: number): string {
  const hours = Math.trunc(durationInSeconds / 3600);
  const minutes = Math.trunc((durationInSeconds - hours * 3600) / 60);
  const seconds = Math.trunc(durationInSeconds - hours * 3600 - minutes * 60);

  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}`;
}

export function formatElevation(
  elevationInMeters: number | undefined,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideUnit?: boolean,
): string {
  'worklet';

  if (typeof elevationInMeters === 'undefined') {
    return '';
  }

  const { elevation, unit } =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? { elevation: elevationInMeters, unit: 'm' }
      : { elevation: elevationInMeters * 3.28084, unit: 'ft' };

  const roundedElevation = Math.round(elevation);
  return `${roundedElevation}${hideUnit ? '' : unit}`;
}

export function formatPace(
  paceInMinutesPerKilometers: number | undefined,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideUnit?: boolean,
): string {
  'worklet';

  if (typeof paceInMinutesPerKilometers === 'undefined') {
    return '';
  }

  const { pace, unit } =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? { pace: paceInMinutesPerKilometers, unit: 'min/km' }
      : { pace: paceInMinutesPerKilometers, unit: 'min/mi' };

  const roundedPace = Math.round(pace * 100) / 100;
  return `${roundedPace.toFixed(2).replace('.', ':')}${hideUnit ? '' : unit}`;
}

export function formatSpeed(
  speedInKilometerPerHour: number | undefined,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideUnit?: boolean,
): string {
  'worklet';

  if (typeof speedInKilometerPerHour === 'undefined') {
    return '';
  }

  const { speed, unit } =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? { speed: speedInKilometerPerHour, unit: 'km/h' }
      : { speed: convertPaceInMilesPerHour(speedInKilometerPerHour), unit: 'mph' };

  const roundedSpeed = Math.round(speed * 10) / 10;
  return `${roundedSpeed.toFixed(1)}${hideUnit ? '' : unit}`;
}

export function formatCalories(calories: number): string {
  return `${Math.round(calories)}kcal`;
}
