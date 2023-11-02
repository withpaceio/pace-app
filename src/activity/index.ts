import convertPaceInMilesPerHour from './convertPaceInMilesPerHour';
import convertPaceInMinutesPerKmToKmPerHour from './convertPaceInMinutesPerKmToKmPerHour';
import convertPaceInMinutesPerMiles from './convertPaceInMinutesPerMiles';
import convertPaceKmPerHourToMinutesPerKm from './convertPaceKmPerHourToMinutesPerKm';
import decryptActivity from './decryptActivity';
import decryptCreationDate from './decryptCreationDate';
import decryptDefaultActivityType from './decryptDefaultActivityType';
import decryptLocations from './decryptLocations';
import decryptMapSnapshot from './decryptMapSnapshot';
import decryptSummary from './decryptSummary';
import encryptActivity from './encryptActivity';
import encryptCreationDate from './encryptCreationDate';
import encryptDefaultActivityType from './encryptDefaultActivityType';
import encryptLocations from './encryptLocations';
import encryptMapSnapshot from './encryptMapSnapshot';
import encryptSummary from './encryptSummary';
import {
  formatCalories,
  formatDistance,
  formatDuration,
  formatElevation,
  formatPace,
  formatSpeed,
  formatStopwatchDuration,
} from './format';
import getBounds from './getBounds';
import getCalories from './getCalories';
import getCumulativeDistanceInMeters from './getCumulativeDistanceInMeters';
import getDistanceInKilometers, {
  computeDistanceBetweenPointsInMeters,
} from './getDistanceInKilometers';
import getDurationInSeconds from './getDurationInSeconds';
import getElevationGainInMeters from './getElevationGainInMeters';
import getElevationInMeters from './getElevationInMeters';
import getFilteredLocations from './getFilteredLocations';
import getLineCoordinatesFromSegments from './getLineCoordinatesFromSegments';
import getMovingDurationInSeconds from './getMovingDurationInSeconds';
import getPaceInMinutesPerKilometers from './getPaceInMinutesPerKilometers';
import getSpeedInKilometersPerHour from './getSpeedInKilometersPerHour';
import getSplits from './getSplitPace';
import getPaceHistogram from './histogram/getPaceHistogram';
import getSpeedHistogram from './histogram/getSpeedHistogram';
import {
  prepareDataHistogram,
  binarySearch as searchDistance,
  smoothHistogram,
} from './histogram/helpers';
import type { Histogram as HistogramImported } from './histogram/types';
import { Split as SplitActivity } from './types';
import uploadActivity from './upload';
import { convertKilogramsToPounds, convertPoundsToKilograms } from './utils';

export {
  computeDistanceBetweenPointsInMeters,
  convertKilogramsToPounds,
  convertPaceInMilesPerHour,
  convertPaceInMinutesPerKmToKmPerHour,
  convertPaceInMinutesPerMiles,
  convertPaceKmPerHourToMinutesPerKm,
  convertPoundsToKilograms,
  decryptActivity,
  decryptCreationDate,
  decryptDefaultActivityType,
  decryptLocations,
  decryptMapSnapshot,
  decryptSummary,
  encryptActivity,
  encryptCreationDate,
  encryptDefaultActivityType,
  encryptLocations,
  encryptMapSnapshot,
  encryptSummary,
  formatCalories,
  formatDistance,
  formatDuration,
  formatStopwatchDuration,
  formatElevation,
  formatPace,
  formatSpeed,
  getBounds,
  getCalories,
  getCumulativeDistanceInMeters,
  getDistanceInKilometers,
  getDurationInSeconds,
  getElevationGainInMeters,
  getElevationInMeters,
  getFilteredLocations,
  getLineCoordinatesFromSegments,
  getMovingDurationInSeconds,
  getPaceHistogram,
  getPaceInMinutesPerKilometers,
  getSpeedInKilometersPerHour,
  getSpeedHistogram,
  getSplits,
  prepareDataHistogram,
  searchDistance,
  smoothHistogram,
  uploadActivity,
};

export type Split = SplitActivity;
export type Histogram = HistogramImported;
