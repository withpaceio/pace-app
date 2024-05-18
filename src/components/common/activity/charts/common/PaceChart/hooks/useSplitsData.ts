import { useMemo } from 'react';

import { type SkPath, Skia } from '@shopify/react-native-skia';
import { line } from 'd3-shape';
import { type SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';

import type { Histogram, Split } from '@activity';
import { useTheme } from '@theme';

import { type ActivityLocationDistance } from '@models/Activity';

import { getSplitPaths, getStartEndIndices } from '../utils';
import type { Scale } from './useScaleLinear';

type Args = {
  invertYAxis: boolean;
  splits: Split[];
  histogram: Histogram;
  scale: Scale;
  cumulativeRawData: ActivityLocationDistance[];
  currentHighlightedSplit: SharedValue<number>;
  previousHighlightedSplit: SharedValue<number>;
  splitPathsTransition: SharedValue<number>;
};

type SplitsData = {
  highlightedSplitOpacity: Readonly<SharedValue<number>>;
  highlightedSplitPath: Readonly<SharedValue<SkPath>>;
};

export default function useSplitsData({
  invertYAxis,
  splits,
  histogram,
  scale,
  cumulativeRawData,
  currentHighlightedSplit,
  previousHighlightedSplit,
  splitPathsTransition,
}: Args): SplitsData {
  const theme = useTheme();

  const yPaceFn = useMemo(
    () =>
      invertYAxis
        ? ({ y }: { y: number }) => theme.sizes.paceChart.height - scale.apply(y)
        : ({ y }: { y: number }) => scale.apply(y),
    [invertYAxis, theme.sizes.paceChart.height, scale],
  );

  const pathLineGenerator = useMemo(
    () =>
      line<{ x: number; y: number }>()
        .defined((current) => !Number.isNaN(current))
        .x(({ x }, index) => x + index)
        .y(yPaceFn),
    [yPaceFn],
  );

  const pathLineNormalizer = useMemo(
    () =>
      line<{ x: number; y: number }>()
        .defined((current) => !Number.isNaN(current))
        .x(({ x }) => x)
        .y(yPaceFn),
    [yPaceFn],
  );

  const { indices, maxSplitNumPoints } = useMemo(
    () => getStartEndIndices(splits, cumulativeRawData, histogram),
    [cumulativeRawData, histogram, splits],
  );

  const splitPaths = useMemo(
    () =>
      getSplitPaths(
        splits,
        indices,
        maxSplitNumPoints,
        histogram,
        pathLineGenerator,
        pathLineNormalizer,
      ),
    [indices, maxSplitNumPoints, pathLineGenerator, pathLineNormalizer, histogram, splits],
  );

  const highlightedSplitOpacity = useDerivedValue(
    () => withTiming((currentHighlightedSplit.value !== -1 ? 1 : 0) as number, { duration: 500 }),
    [currentHighlightedSplit],
  );

  const highlightedSplitPath = useDerivedValue(() => {
    if (
      currentHighlightedSplit.value === -1 &&
      previousHighlightedSplit.value !== -1 &&
      highlightedSplitOpacity.value !== 0
    ) {
      return splitPaths[previousHighlightedSplit.value]!;
    }

    const currentPath = splitPaths[currentHighlightedSplit.value];
    if (!currentPath) {
      return Skia.Path.Make();
    }

    if (previousHighlightedSplit.value === -1) {
      return currentPath;
    }

    const previousPath = splitPaths[previousHighlightedSplit.value];
    if (!previousPath) {
      return currentPath;
    }

    return currentPath.interpolate(previousPath, splitPathsTransition.value!)!;
  }, [
    currentHighlightedSplit,
    previousHighlightedSplit,
    splitPaths,
    highlightedSplitOpacity,
    splitPathsTransition,
  ]);

  return { highlightedSplitOpacity, highlightedSplitPath };
}
