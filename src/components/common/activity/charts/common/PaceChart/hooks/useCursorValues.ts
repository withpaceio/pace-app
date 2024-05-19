import { type SkRRect, rect, rrect } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated';

import { formatDuration, formatElevation, formatPace, formatSpeed } from '@activity';
import { useTheme } from '@theme';

import { ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import type { ChartCursorProps } from '../types';

type CursorValues = {
  formattedDuration: Readonly<SharedValue<string>>;
  formattedDistance: Readonly<SharedValue<string>>;
  formattedPace: Readonly<SharedValue<string>>;
  formattedElevation: Readonly<SharedValue<string>>;
  transformSpeed: Readonly<
    SharedValue<
      (
        | { translateX: number; translateY?: undefined }
        | { translateX?: undefined; translateY: number }
      )[]
    >
  >;
  transformElevation: Readonly<
    SharedValue<
      (
        | { translateX: number; translateY?: undefined }
        | { translateX?: undefined; translateY: number }
      )[]
    >
  >;
  transformLabel: Readonly<
    SharedValue<
      (
        | { translateX: number; translateY?: undefined }
        | { translateX?: undefined; translateY: number }
      )[]
    >
  >;
  opacity: Readonly<SharedValue<number>>;
  clip: Readonly<SharedValue<SkRRect>>;
};

export default function useCursorValues({
  x,
  isActive,
  activityType,
  chartWidth,
  timeScale,
  distanceScale,
  paceHistogram,
  paceScale,
  elevationHistogram,
  elevationScale,
  distanceMeasurementSystem,
}: ChartCursorProps): CursorValues {
  const {
    sizes: {
      outerPadding,
      paceChart: {
        height: chartHeight,
        cursor: { width: cursorWidth, height: cursorHeight },
      },
    },
  } = useTheme();

  const formattedDuration = useDerivedValue(
    () => formatDuration(Math.max(0, timeScale.invert(x.value))),
    [timeScale, x],
  );

  const formattedDistance = useDerivedValue(() => {
    const distance = Math.max(0, distanceScale.invert(x.value) / 1000).toFixed(2);
    return `${distance} ${
      distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 'km' : 'mi'
    }`;
  }, [distanceScale, x]);

  const formattedPace = useDerivedValue(() => {
    const currentPace = paceHistogram.histogram[Math.floor(x.value)];
    return activityType === ActivityType.RUNNING
      ? formatPace(currentPace, distanceMeasurementSystem)
      : formatSpeed(currentPace, distanceMeasurementSystem);
  }, [x, distanceMeasurementSystem, paceHistogram]);

  const formattedElevation = useDerivedValue(() => {
    const currentElevation = elevationHistogram.histogram[Math.floor(x.value)];
    return formatElevation(currentElevation, distanceMeasurementSystem);
  }, [x, distanceMeasurementSystem, elevationHistogram]);

  const yPace = useDerivedValue(() => {
    const pace = paceHistogram.histogram[Math.floor(x.value)];
    return activityType === ActivityType.RUNNING
      ? chartHeight - paceScale.apply(pace)
      : paceScale.apply(pace);
  }, [chartHeight, paceHistogram, x]);

  const yElevation = useDerivedValue(() => {
    const elevation = elevationHistogram.histogram[Math.floor(x.value)];
    return elevationScale.apply(elevation);
  }, [elevationHistogram, x]);

  const yLabel = useDerivedValue(() => {
    const yAverage = Math.max(
      0,
      Math.min(chartHeight - cursorHeight, (yPace.value + yElevation.value - cursorHeight) / 2),
    );
    return withSpring(yAverage, { overshootClamping: false });
  }, [cursorHeight, yElevation, yPace]);

  const transformSpeed = useDerivedValue(
    () => [{ translateX: x.value }, { translateY: yPace.value }],
    [x, yPace],
  );

  const transformLabel = useDerivedValue(() => {
    const translateX =
      x.value + cursorWidth > chartWidth - outerPadding
        ? x.value - cursorWidth - outerPadding
        : x.value + outerPadding;

    return [{ translateX }, { translateY: yLabel.value }];
  }, [chartWidth, cursorWidth, outerPadding, x, yPace]);

  const transformElevation = useDerivedValue(
    () => [{ translateX: x.value }, { translateY: yElevation.value }],
    [x, yElevation],
  );

  const opacity = useDerivedValue(() => withTiming((isActive.value ? 1 : 0) as number), [isActive]);
  const clip = useDerivedValue(
    () =>
      rrect(rect(0, 0, opacity.value ? cursorWidth : 0, opacity.value ? cursorHeight : 0), 10, 10),
    [cursorWidth, cursorHeight, opacity],
  );

  return {
    formattedDuration,
    formattedDistance,
    formattedPace,
    formattedElevation,
    transformSpeed,
    transformElevation,
    transformLabel,
    opacity,
    clip,
  };
}
