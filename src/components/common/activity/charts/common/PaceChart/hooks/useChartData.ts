import { useMemo } from 'react';

import { scaleLinear } from 'd3-scale';
import { area, line } from 'd3-shape';

import {
  type Histogram,
  convertPaceKmPerHourToMinutesPerKm,
  getCumulativeDistanceInMeters,
  getSpeedHistogram,
  prepareDataHistogram,
  smoothHistogram,
} from '@activity';
import { useTheme } from '@theme';

import {
  type ActivityLocation,
  type ActivityLocationDistance,
  ActivityType,
} from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import useScaleLinear, { type Scale } from './useScaleLinear';

type Args = {
  activityType: ActivityType;
  chartWidth: number;
  duration: number;
  averagePace: number;
  locations: ActivityLocation[];
  distanceMeasurementSystem: DistanceMeasurementSystem;
};

type ChartData = {
  timeScale: Scale;
  distanceScale: Scale;
  paceHistogram: Histogram;
  cumulativeRawSpeedData: ActivityLocationDistance[];
  paceScale: Scale;
  distanceTicks: { label: string; x: number }[];
  pacePath: string | null;
  paceBackgroundPath: string | null;
  yAveragePace: number;
  elevationHistogram: Histogram;
  elevationPath: string | null;
  elevationBackgroundPath: string | null;
  elevationTicks: { label: string; y: number }[];
  elevationScale: Scale;
};

export default function useChartData({
  activityType,
  chartWidth,
  duration,
  averagePace,
  locations,
  distanceMeasurementSystem,
}: Args): ChartData {
  const theme = useTheme();

  const preparedData = useMemo(() => prepareDataHistogram(locations), [locations]);
  const { pace, elevation } = useMemo(() => {
    const { pace: speedHistogram, elevation: elevationHistogram } = getSpeedHistogram(
      preparedData,
      chartWidth,
      distanceMeasurementSystem,
    );

    const smoothedSpeedHistogram = smoothHistogram(speedHistogram, 1.5);
    const smoothedElevationHistogram = smoothHistogram(elevationHistogram, 1.5);

    const smoothedPaceHistogram =
      activityType === ActivityType.RUNNING
        ? smoothedSpeedHistogram.map((speed) =>
            Math.max(0, Math.min(10, convertPaceKmPerHourToMinutesPerKm(speed))),
          )
        : smoothedSpeedHistogram;

    return {
      pace: {
        histogram: smoothedPaceHistogram,
        min: Math.min(...smoothedPaceHistogram),
        max: Math.max(...smoothedPaceHistogram),
      },
      elevation: {
        histogram: smoothedElevationHistogram,
        min: Math.min(...smoothedElevationHistogram),
        max: Math.max(...smoothedElevationHistogram),
      },
    };
  }, [activityType, chartWidth, distanceMeasurementSystem, preparedData]);

  const cumulativeDistances = useMemo(
    () => getCumulativeDistanceInMeters(locations, distanceMeasurementSystem),
    [locations, distanceMeasurementSystem],
  );

  const xScaleTicks = useMemo(
    () =>
      scaleLinear()
        .rangeRound([0, chartWidth])
        .domain([0, cumulativeDistances[cumulativeDistances.length - 1]?.cumulativeDistance ?? 0]),
    [chartWidth, cumulativeDistances],
  );

  const timeScale = useScaleLinear([0, chartWidth], [0, duration]);

  const xScale = useScaleLinear(
    [0, chartWidth],
    [0, cumulativeDistances[cumulativeDistances.length - 1]?.cumulativeDistance ?? 0],
  );

  const yScale = useScaleLinear([0, theme.sizes.paceChart.height], [pace.min, pace.max]);

  const yScaleElevation = useScaleLinear(
    [0, theme.sizes.paceChart.height],
    [elevation.min, elevation.max],
  );

  const yPaceFn = useMemo(
    () =>
      activityType === ActivityType.RUNNING
        ? (value: number) => theme.sizes.paceChart.height - yScale.apply(value)
        : (value: number) => yScale.apply(value),
    [activityType, theme.sizes.paceChart.height, yScale],
  );

  const pacePath = useMemo(
    () =>
      line<number>()
        .defined((current) => !Number.isNaN(current))
        .x((_, index) => index)
        .y(yPaceFn)(pace.histogram),
    [pace.histogram, yPaceFn],
  );

  const paceBackgroundPath = useMemo(
    () =>
      area<number>()
        .defined((d) => !Number.isNaN(d))
        .x((_, index) => index)
        .y0(yPaceFn)
        .y1(theme.sizes.paceChart.height)(pace.histogram),
    [pace.histogram, theme.sizes.paceChart.height, yPaceFn],
  );

  const yAveragePace = useMemo(() => yPaceFn(averagePace), [averagePace, yPaceFn]);

  const elevationPath = useMemo(
    () =>
      line<number>()
        .defined((current) => !Number.isNaN(current))
        .x((_, index) => index)
        .y((value) => yScaleElevation.apply(value))(elevation.histogram),
    [elevation.histogram, yScaleElevation],
  );

  const elevationBackgroundPath = useMemo(
    () =>
      area<number>()
        .defined((d) => !Number.isNaN(d))
        .x((_, index) => index)
        .y0((value) => yScaleElevation.apply(value))
        .y1(theme.sizes.paceChart.height)(elevation.histogram),
    [elevation.histogram, theme.sizes.paceChart.height, yScaleElevation],
  );

  const distanceTicks = useMemo(() => {
    const unit = distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 'km' : 'mi';

    return xScaleTicks.ticks(4).map((tick) => ({
      label: `${tick / 1000}${unit}`,
      x: xScaleTicks(tick),
    }));
  }, [distanceMeasurementSystem, xScaleTicks]);

  const elevationTicks = useMemo(() => {
    const unit = distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 'm' : 'ft';
    const minElevation = Math.round(elevation.min);
    const maxElevation = Math.round(elevation.max);

    return [
      { label: `${minElevation}${unit}`, y: theme.sizes.paceChart.height - 5 },
      { label: `${maxElevation}${unit}`, y: yScaleElevation.apply(maxElevation) },
    ];
  }, [
    distanceMeasurementSystem,
    elevation.max,
    elevation.min,
    theme.sizes.paceChart.height,
    yScaleElevation,
  ]);

  return {
    timeScale,
    distanceScale: xScale,
    paceHistogram: pace,
    cumulativeRawSpeedData: preparedData,
    paceScale: yScale,
    distanceTicks,
    pacePath,
    paceBackgroundPath,
    yAveragePace,
    elevationHistogram: elevation,
    elevationPath,
    elevationBackgroundPath,
    elevationTicks,
    elevationScale: yScaleElevation,
  };
}
