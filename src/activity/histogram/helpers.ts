import type { ActivityLocation, ActivityLocationDistance } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import type { Histogram } from './types';
import { computeDistanceBetweenPointsInMeters } from '../getDistanceInKilometers';

export function binarySearch(locations: ActivityLocationDistance[], distance: number): number {
  let low = 0;
  let high = locations.length - 1;
  let index = -1;

  while (index === -1 && low <= high) {
    const mid = Math.floor((high + low) / 2);
    if (locations[mid].cumulativeDistance === distance) {
      index = mid;
    } else if (locations[mid].cumulativeDistance < distance) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -(low + 1);
}

export function buildPixelBounds(start: number, end: number, numBins: number): number[] {
  const binSize = (end - start) / numBins;
  const pixelBounds: number[] = [];

  for (let i = 0; i < numBins; i += 1) {
    pixelBounds.push(i * binSize);
  }

  return pixelBounds;
}

export function prepareDataHistogram(locations: ActivityLocation[]): ActivityLocationDistance[] {
  return locations.reduce<ActivityLocationDistance[]>((allDistances, currentLocation, index) => {
    if (index === 0) {
      allDistances.push({
        ...currentLocation,
        cumulativeDistance: 0,
        pace: 0,
      });
      return allDistances;
    }

    const previousLocation = allDistances[index - 1];
    const distance =
      previousLocation.segment === currentLocation.segment
        ? computeDistanceBetweenPointsInMeters(previousLocation, currentLocation)
        : 0;

    allDistances.push({
      ...currentLocation,
      cumulativeDistance: previousLocation.cumulativeDistance + distance,
      pace: 0,
    });

    return allDistances;
  }, []);
}

export function getHistogram(
  locations: ActivityLocationDistance[],
  length: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  computePacePoint: (
    distanceDifference: number,
    timeDifference: number,
    distanceMeasurementSystem: DistanceMeasurementSystem,
  ) => number,
): { pace: Histogram; elevation: Histogram } {
  if (locations.length === 0) {
    return {
      pace: { histogram: [], min: 0, max: 0 },
      elevation: { histogram: [], min: 0, max: 0 },
    };
  }

  const paceHistogram = [];
  const elevationHistogram = [];

  const pixelBounds = buildPixelBounds(
    locations[0].cumulativeDistance,
    locations[locations.length - 1].cumulativeDistance,
    length,
  );

  const indices: number[] = [];
  for (let i = 0; i < pixelBounds.length; i += 1) {
    const index = binarySearch(locations, pixelBounds[i]);
    indices.push(index >= 0 ? index : -index - 1);
  }

  let minPace = Number.MAX_SAFE_INTEGER;
  let maxPace = Number.MIN_SAFE_INTEGER;

  let minElevation = Number.MAX_SAFE_INTEGER;
  let maxElevation = Number.MIN_SAFE_INTEGER;

  const elevationConversionFactor =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 1 : 3.28084;

  for (let i = 0; i < indices.length - 1; i += 1) {
    const currentLocation = locations[indices[i]];
    const nextLocation = locations[indices[i + 1]];

    const distanceDifference = nextLocation.cumulativeDistance - currentLocation.cumulativeDistance;
    const timeDifference = nextLocation.timestamp - currentLocation.timestamp;

    const pace = computePacePoint(distanceDifference, timeDifference, distanceMeasurementSystem);
    const elevation = currentLocation.altitude * elevationConversionFactor;

    minPace = Number.isNaN(pace) ? minPace : Math.min(pace, minPace);
    maxPace = Number.isNaN(pace) ? maxPace : Math.max(pace, maxPace);
    minElevation = Math.min(elevation, minElevation);
    maxElevation = Math.max(maxElevation, elevation);

    paceHistogram.push(Number.isNaN(pace) ? 0 : pace);
    elevationHistogram.push(elevation);
  }

  return {
    pace: { histogram: paceHistogram, min: minPace, max: maxPace },
    elevation: { histogram: elevationHistogram, min: minElevation, max: maxElevation },
  };
}

function computeKernelValues(kernelBandwidth: number): number[] {
  const h = 2 * Math.pow(kernelBandwidth, 2);
  const v = 1 / (kernelBandwidth * Math.sqrt(2 * Math.PI));
  const kernelSize = Math.floor(Math.ceil(kernelBandwidth * 3) * 2 + 1);

  const kernelValues: number[] = [];
  for (let i = 0; i < kernelSize; i += 1) {
    kernelValues.push(Math.exp(-Math.pow(i - kernelSize / 2, 2) / h) * v);
  }

  return kernelValues;
}

export function smoothHistogram({ histogram }: Histogram, kernelBandwidth: number): number[] {
  const kernelValues = computeKernelValues(kernelBandwidth);
  const smoothedHistogram: number[] = Array(histogram.length + 2 * kernelValues.length).fill(0);

  for (let i = 0; i < smoothedHistogram.length; i += 1) {
    for (let k = 0; k < kernelValues.length; k += 1) {
      const j = Math.ceil(i + k - kernelValues.length / 2);
      if (j < 0 || j > smoothedHistogram.length - 1) {
        continue;
      }

      const histogramIndex = Math.min(Math.max(j - kernelValues.length, 0), histogram.length - 1);
      smoothedHistogram[i] = smoothedHistogram[i] + histogram[histogramIndex] * kernelValues[k];
    }
  }

  return smoothedHistogram.slice(kernelValues.length, -kernelValues.length);
}
